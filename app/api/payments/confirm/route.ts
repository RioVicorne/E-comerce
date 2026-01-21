import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payments/confirm
 * Xác nhận thanh toán (admin hoặc webhook)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, description, confirmedBy = "admin" } = body;

    if (!transactionId && !description) {
      return NextResponse.json(
        { error: "Cần cung cấp transactionId hoặc description" },
        { status: 400 }
      );
    }

    // Find payment
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          transactionId ? { transactionId } : {},
          description ? { description } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
        status: "pending", // Only confirm pending payments
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Không tìm thấy giao dịch hoặc đã được xác nhận" },
        { status: 404 }
      );
    }

    // Check if expired
    const now = new Date();
    if (payment.expiresAt < now) {
      return NextResponse.json(
        { error: "Giao dịch đã hết hạn" },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "completed",
        paidAt: new Date(),
        confirmedBy,
      },
    });

    // If user is linked, update their balance
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
        description: updatedPayment.description,
        amount: Number(updatedPayment.amount),
        status: updatedPayment.status,
        paidAt: updatedPayment.paidAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Lỗi khi xác nhận thanh toán" },
      { status: 500 }
    );
  }
}
