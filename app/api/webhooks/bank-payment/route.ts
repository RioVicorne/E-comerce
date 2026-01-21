import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyWebhookSignature,
  getWebhookConfig,
} from "@/lib/webhook-utils";

/**
 * POST /api/webhooks/bank-payment
 * Webhook từ ngân hàng để xác nhận thanh toán tự động
 * 
 * Cách sử dụng:
 * 1. Đăng ký webhook URL với ngân hàng: https://yoursite.com/api/webhooks/bank-payment
 * 2. Nhận secret key từ ngân hàng
 * 3. Set environment variable: BANK_WEBHOOK_SECRET=your_secret_key
 * 4. Ngân hàng sẽ gửi POST request đến endpoint này khi có giao dịch
 * 
 * Format webhook từ ngân hàng (ví dụ):
 * {
 *   "transactionId": "TXN123456",
 *   "amount": 50000,
 *   "description": "Nap tien vao vi 1768815930428",
 *   "accountNumber": "1105200789",
 *   "timestamp": "2026-01-13T14:30:00Z",
 *   "status": "success"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Verify webhook signature
    const webhookConfig = getWebhookConfig();
    if (webhookConfig) {
      // Convert Headers to plain object for verification
      const headers: Record<string, string> = {};
      request.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const isValid = verifyWebhookSignature(
        rawBody, // Use raw body for signature verification
        headers,
        webhookConfig
      );

      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } else {
      // In development, log warning if no secret is configured
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "⚠️ BANK_WEBHOOK_SECRET not set. Webhook verification is disabled."
        );
      }
    }

    // Extract webhook data (có thể khác nhau tùy ngân hàng)
    const {
      description,
      amount,
      transactionId,
      accountNumber,
      referenceNumber, // Số tham chiếu từ ngân hàng
      bankTransactionId, // Transaction ID từ ngân hàng
      timestamp,
      status,
      // Các trường khác có thể có
    } = body;

    // Find payment by description or transactionId
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          description ? { description } : {},
          transactionId ? { transactionId } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!payment) {
      console.warn("Payment not found for webhook:", { description, transactionId });
      return NextResponse.json(
        { error: "Không tìm thấy giao dịch" },
        { status: 404 }
      );
    }

    // Verify amount matches
    if (amount && Number(amount) !== Number(payment.amount)) {
      console.warn("Amount mismatch:", { expected: payment.amount, received: amount });
      return NextResponse.json(
        { error: "Số tiền không khớp" },
        { status: 400 }
      );
    }

    // Verify account number if provided
    if (accountNumber && accountNumber !== payment.accountNumber) {
      console.warn("Account number mismatch");
      return NextResponse.json(
        { error: "Số tài khoản không khớp" },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "completed",
        paidAt: new Date(timestamp || new Date()),
        confirmedBy: "webhook",
        metadata: JSON.stringify({
          ...body,
          receivedAt: new Date().toISOString(),
          bankTransactionId: bankTransactionId || transactionId,
          referenceNumber,
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
            description: `Nạp tiền vào ví - ${payment.description}`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thanh toán đã được xác nhận",
      payment: {
        id: updatedPayment.id,
        transactionId: updatedPayment.transactionId,
      },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Lỗi khi xử lý webhook" },
      { status: 500 }
    );
  }
}
