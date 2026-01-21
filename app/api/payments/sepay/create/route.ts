import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSePayPayment } from "@/lib/sepay-client";

/**
 * POST /api/payments/sepay/create
 * Tạo payment request với SePay
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      description,
      userId,
      successUrl,
      errorUrl,
      cancelUrl,
    } = body;

    // Validate
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Số tiền không hợp lệ" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Nội dung không được để trống" },
        { status: 400 }
      );
    }

    // Get SePay config from environment
    const merchantId = process.env.SEPAY_MERCHANT_ID;
    const secretKey = process.env.SEPAY_SECRET_KEY;
    const isProduction = process.env.SEPAY_ENV === "production";

    if (!merchantId || !secretKey) {
      return NextResponse.json(
        { error: "SePay chưa được cấu hình. Vui lòng set SEPAY_MERCHANT_ID và SEPAY_SECRET_KEY" },
        { status: 500 }
      );
    }

    // Generate unique transaction ID
    const timestamp = Date.now();
    const transactionId = `deposit-${timestamp}`;

    // Create payment record first
    const payment = await prisma.payment.create({
      data: {
        transactionId,
        description,
        amount: amount,
        status: "pending",
        bankName: "SePay",
        accountNumber: "N/A",
        accountName: "SePay Gateway",
        userId: userId || null,
        qrGeneratedAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        metadata: JSON.stringify({
          paymentGateway: "sepay",
          createdAt: new Date().toISOString(),
        }),
      },
    });

    // Get base URL for callbacks
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    // Create SePay payment
    const sepayResponse = await createSePayPayment(
      {
        merchantId,
        secretKey,
        isProduction,
      },
      {
        orderId: transactionId,
        orderAmount: amount,
        orderDescription: description,
        successUrl: successUrl || `${baseUrl}/payment/success?transactionId=${transactionId}`,
        errorUrl: errorUrl || `${baseUrl}/payment/error?transactionId=${transactionId}`,
        cancelUrl: cancelUrl || `${baseUrl}/payment/cancel?transactionId=${transactionId}`,
        ipnUrl: `${baseUrl}/api/webhooks/sepay`,
        customData: {
          paymentId: payment.id,
          transactionId,
        },
      }
    );

    // Update payment with SePay order ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: JSON.stringify({
          paymentGateway: "sepay",
          sepayOrderId: sepayResponse.orderId,
          checkoutUrl: sepayResponse.checkoutUrl,
          createdAt: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        description: payment.description,
        amount: Number(payment.amount),
        status: payment.status,
      },
      checkoutUrl: sepayResponse.checkoutUrl,
    });
  } catch (error: any) {
    console.error("Error creating SePay payment:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi tạo payment request" },
      { status: 500 }
    );
  }
}
