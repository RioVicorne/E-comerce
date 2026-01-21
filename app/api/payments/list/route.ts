import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payments/list?status=pending&limit=10
 * Lấy danh sách payments (cho admin panel)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // "pending" | "completed" | "expired" | "all"
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      payments: payments.map((p) => ({
        id: p.id,
        transactionId: p.transactionId,
        description: p.description,
        amount: Number(p.amount),
        status: p.status,
        bankName: p.bankName,
        accountNumber: p.accountNumber,
        accountName: p.accountName,
        userId: p.userId,
        qrGeneratedAt: p.qrGeneratedAt.toISOString(),
        expiresAt: p.expiresAt.toISOString(),
        paidAt: p.paidAt?.toISOString() || null,
        confirmedBy: p.confirmedBy,
        createdAt: p.createdAt.toISOString(),
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error listing payments:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách payments" },
      { status: 500 }
    );
  }
}
