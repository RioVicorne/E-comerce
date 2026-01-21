import crypto from "crypto";

/**
 * Webhook signature verification utilities
 * Hỗ trợ nhiều phương thức xác minh chữ ký phổ biến
 */

export interface WebhookConfig {
  secret: string; // Secret key từ ngân hàng
  algorithm?: "sha256" | "sha512" | "hmac-sha256"; // Algorithm để verify
  headerName?: string; // Tên header chứa signature (default: "x-signature")
}

/**
 * Verify webhook signature using HMAC SHA256
 * Đây là phương thức phổ biến nhất
 */
export function verifyHMACSignature(
  payload: string | object,
  signature: string,
  secret: string
): boolean {
  try {
    const payloadString =
      typeof payload === "string" ? payload : JSON.stringify(payload);
    
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payloadString);
    const expectedSignature = hmac.digest("hex");
    
    // Constant-time comparison để tránh timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("Error verifying HMAC signature:", error);
    return false;
  }
}

/**
 * Verify webhook signature with prefix (e.g., "sha256=...")
 */
export function verifyHMACSignatureWithPrefix(
  payload: string | object,
  signature: string,
  secret: string
): boolean {
  try {
    // Remove prefix if exists (e.g., "sha256=abc123" -> "abc123")
    const cleanSignature = signature.replace(/^(sha256|sha512)=/, "");
    return verifyHMACSignature(payload, cleanSignature, secret);
  } catch (error) {
    console.error("Error verifying signature with prefix:", error);
    return false;
  }
}

/**
 * Verify webhook signature from header
 */
export function verifyWebhookSignature(
  payload: string | object,
  headers: Headers | Record<string, string>,
  config: WebhookConfig
): boolean {
  const headerName = config.headerName || "x-signature";
  
  // Get signature from headers
  let signature: string | null = null;
  
  if (headers instanceof Headers) {
    signature = headers.get(headerName);
  } else {
    signature = headers[headerName] || headers[headerName.toLowerCase()];
  }
  
  if (!signature) {
    console.warn(`Signature header "${headerName}" not found`);
    return false;
  }
  
  // Verify based on algorithm
  switch (config.algorithm || "sha256") {
    case "sha256":
    case "hmac-sha256":
      return verifyHMACSignatureWithPrefix(
        payload,
        signature,
        config.secret
      );
    case "sha512":
      // Similar to sha256 but with sha512
      try {
        const payloadString =
          typeof payload === "string" ? payload : JSON.stringify(payload);
        const hmac = crypto.createHmac("sha512", config.secret);
        hmac.update(payloadString);
        const expectedSignature = hmac.digest("hex");
        const cleanSignature = signature.replace(/^(sha512)=/, "");
        return crypto.timingSafeEqual(
          Buffer.from(cleanSignature),
          Buffer.from(expectedSignature)
        );
      } catch (error) {
        return false;
      }
    default:
      console.warn(`Unsupported algorithm: ${config.algorithm}`);
      return false;
  }
}

/**
 * Get webhook configuration from environment variables
 */
export function getWebhookConfig(): WebhookConfig | null {
  const secret = process.env.BANK_WEBHOOK_SECRET;
  
  if (!secret) {
    return null; // Webhook verification disabled
  }
  
  return {
    secret,
    algorithm: (process.env.BANK_WEBHOOK_ALGORITHM as any) || "sha256",
    headerName: process.env.BANK_WEBHOOK_HEADER || "x-signature",
  };
}

/**
 * Generate test signature (for testing purposes)
 */
export function generateTestSignature(
  payload: string | object,
  secret: string,
  algorithm: "sha256" | "sha512" = "sha256"
): string {
  const payloadString =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  
  if (algorithm === "sha512") {
    const hmac = crypto.createHmac("sha512", secret);
    hmac.update(payloadString);
    return `sha512=${hmac.digest("hex")}`;
  } else {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payloadString);
    return `sha256=${hmac.digest("hex")}`;
  }
}
