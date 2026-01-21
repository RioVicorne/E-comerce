import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payments/check?transactionId=xxx
 * Kiểm tra trạng thái thanh toán
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get("transactionId");
    const description = searchParams.get("description");

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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!payment) {
      return NextResponse.json({
        success: true,
        confirmed: false,
        message: "Không tìm thấy giao dịch",
      });
    }

    // Check if expired
    const now = new Date();
    const isExpired = payment.expiresAt < now && payment.status === "pending";

    if (isExpired) {
      // Update status to expired
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "expired" },
      });
    }

    return NextResponse.json({
      success: true,
      confirmed: payment.status === "completed",
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        description: payment.description,
        amount: Number(payment.amount),
        status: payment.status,
        paidAt: payment.paidAt?.toISOString() || null,
        expiresAt: payment.expiresAt.toISOString(),
        isExpired,
      },
    });
  } catch (error) {
    console.error("Error checking payment:", error);
    return NextResponse.json(
      { error: "Lỗi khi kiểm tra thanh toán" },
      { status: 500 }
    );
  }
}
