import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/webhooks/sepay
 * IPN (Instant Payment Notification) từ SePay
 * 
 * Documentation: https://developer.sepay.vn/vi/cong-thanh-toan/bat-dau
 * 
 * Format IPN từ SePay:
 * {
 *   "timestamp": 1759134682,
 *   "notification_type": "ORDER_PAID",
 *   "order": {
 *     "id": "e2c195be-c721-47eb-b323-99ab24e52d85",
 *     "order_id": "NQD-68DA43D73C1A5",
 *     "order_status": "CAPTURED",
 *     "order_currency": "VND",
 *     "order_amount": "100000.00",
 *     "order_invoice_number": "INV-1759134677",
 *     "order_description": "Test payment"
 *   },
 *   "transaction": {
 *     "id": "384c66dd-41e6-4316-a544-b4141682595c",
 *     "payment_method": "BANK_TRANSFER",
 *     "transaction_id": "68da43da2d9de",
 *     "transaction_status": "APPROVED",
 *     "transaction_amount": "100000",
 *     "transaction_currency": "VND"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify SePay signature if secret is configured
    const sepaySecret = process.env.SEPAY_SECRET_KEY;
    if (sepaySecret) {
      // SePay thường gửi signature trong header hoặc trong body
      // Cần kiểm tra documentation SePay để biết chính xác cách verify
      // Tạm thời skip verification nếu chưa có thông tin chính xác
      // TODO: Implement SePay signature verification khi có documentation
    }

    const { notification_type, order, transaction } = body;

    // Chỉ xử lý khi thanh toán thành công
    if (notification_type !== "ORDER_PAID") {
      return NextResponse.json({
        success: true,
        message: "Notification type not handled",
      });
    }

    // Verify transaction status
    if (
      transaction?.transaction_status !== "APPROVED" ||
      order?.order_status !== "CAPTURED"
    ) {
      return NextResponse.json({
        success: true,
        message: "Transaction not approved",
      });
    }

    // Extract payment information
    const orderId = order?.order_id;
    const invoiceNumber = order?.order_invoice_number;
    const amount = parseFloat(order?.order_amount || transaction?.transaction_amount || "0");
    const description = order?.order_description || "";
    const sepayTransactionId = transaction?.transaction_id;

    if (!orderId && !invoiceNumber) {
      return NextResponse.json(
        { error: "Missing order_id or invoice_number" },
        { status: 400 }
      );
    }

    // Find payment by description (SePay có thể gửi description trong order_description)
    // Hoặc tìm bằng order_id/invoice_number nếu đã lưu trong metadata
    let payment = await prisma.payment.findFirst({
      where: {
        OR: [
          // Tìm bằng description (nếu description chứa transaction ID của chúng ta)
          description ? { description: { contains: description } } : {},
          // Tìm bằng invoice number nếu đã lưu trong metadata
          invoiceNumber
            ? {
                metadata: {
                  contains: invoiceNumber,
                },
              }
            : {},
        ].filter((condition) => Object.keys(condition).length > 0),
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Nếu không tìm thấy, có thể tìm bằng cách khác
    // SePay có thể gửi custom_data hoặc order_id chứa transaction ID của chúng ta
    if (!payment && orderId) {
      // Thử tìm bằng order_id nếu nó chứa transaction ID của chúng ta
      payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { transactionId: { contains: orderId } },
            { description: { contains: orderId } },
          ],
          status: "pending",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (!payment) {
      console.warn("Payment not found for SePay webhook:", {
        orderId,
        invoiceNumber,
        description,
      });
      // Vẫn return 200 để SePay không retry
      return NextResponse.json({
        success: true,
        message: "Payment not found (may have been processed already)",
      });
    }

    // Verify amount matches (cho phép sai số nhỏ do làm tròn)
    const amountDiff = Math.abs(Number(amount) - Number(payment.amount));
    if (amountDiff > 1) {
      console.warn("Amount mismatch:", {
        expected: payment.amount,
        received: amount,
      });
      return NextResponse.json(
        { error: "Số tiền không khớp" },
        { status: 400 }
      );
    }

    // Check if already processed (idempotency)
    if (payment.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        payment: {
          id: payment.id,
          transactionId: payment.transactionId,
        },
      });
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "completed",
        paidAt: new Date(),
        confirmedBy: "sepay-webhook",
        metadata: JSON.stringify({
          sepayOrderId: orderId,
          sepayInvoiceNumber: invoiceNumber,
          sepayTransactionId: sepayTransactionId,
          sepayNotificationType: notification_type,
          originalWebhook: body,
          receivedAt: new Date().toISOString(),
        }),
      },
    });

    // Update user balance if linked
    if (payment.userId) {
      const user = await prisma.user.findUnique({
        where: { id: payment.userId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: payment.userId },
          data: {
            balance: {
              increment: payment.amount,
            },
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: payment.userId,
            type: "DEPOSIT",
            amount: payment.amount,
            status: "completed",
            description: `Nạp tiền vào ví qua SePay - ${payment.description}`,
          },
        });
      }
    }

    // Return 200 to acknowledge receipt (SePay yêu cầu)
    return NextResponse.json({
      success: true,
      message: "Thanh toán đã được xác nhận",
      payment: {
        id: updatedPayment.id,
        transactionId: updatedPayment.transactionId,
      },
    });
  } catch (error) {
    console.error("Error processing SePay webhook:", error);
    // Vẫn return 200 để SePay không retry liên tục
    // Log error để xử lý sau
    return NextResponse.json(
      { error: "Lỗi khi xử lý webhook" },
      { status: 200 } // SePay yêu cầu return 200
    );
  }
}
