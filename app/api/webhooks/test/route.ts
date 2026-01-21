import { NextRequest, NextResponse } from "next/server";
import { generateTestSignature } from "@/lib/webhook-utils";

/**
 * POST /api/webhooks/test
 * Test endpoint để simulate webhook từ ngân hàng
 * 
 * Chỉ hoạt động trong development mode
 * 
 * Usage:
 * curl -X POST http://localhost:3000/api/webhooks/test \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "description": "Nap tien vao vi 1768815930428",
 *     "amount": 50000,
 *     "transactionId": "TXN123456"
 *   }'
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Test endpoint only available in development" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { description, amount, transactionId, accountNumber } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Get webhook secret (use test secret if not set)
    const secret =
      process.env.BANK_WEBHOOK_SECRET || "test-secret-key-change-in-production";

    // Generate signature
    const signature = generateTestSignature(body, secret, "sha256");

    // Forward to actual webhook handler
    const webhookUrl = new URL("/api/webhooks/bank-payment", request.url);
    const response = await fetch(webhookUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": signature,
      },
      body: JSON.stringify({
        description,
        amount: amount || 50000,
        transactionId: transactionId || `TXN-${Date.now()}`,
        accountNumber: accountNumber || "1105200789",
        timestamp: new Date().toISOString(),
        status: "success",
        bankTransactionId: `BANK-${Date.now()}`,
      }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: response.ok,
      message: "Webhook test sent",
      signature,
      webhookResponse: result,
    });
  } catch (error: any) {
    console.error("Error in test webhook:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
