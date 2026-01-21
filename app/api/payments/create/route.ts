import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payments/create
 * Tạo payment request mới (khi user tạo QR code)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description, userId, bankName, accountNumber, accountName } = body;

    // Validate
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Số tiền không hợp lệ" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Nội dung chuyển khoản không được để trống" },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const timestamp = Date.now();
    const transactionId = `deposit-${timestamp}`;

    // Calculate expiration (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        transactionId,
        description,
        amount: amount,
        status: "pending",
        bankName: bankName || "VPBank",
        accountNumber: accountNumber || "1105200789",
        accountName: accountName || "TRAN DINH KHOA",
        userId: userId || null,
        qrGeneratedAt: new Date(),
        expiresAt,
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
        bankName: payment.bankName,
        accountNumber: payment.accountNumber,
        accountName: payment.accountName,
        expiresAt: payment.expiresAt.toISOString(),
        qrGeneratedAt: payment.qrGeneratedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo payment request" },
      { status: 500 }
    );
  }
}
