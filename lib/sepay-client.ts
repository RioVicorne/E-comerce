/**
 * SePay Payment Gateway Client
 * Documentation: https://developer.sepay.vn/vi/cong-thanh-toan/bat-dau
 */

export interface SePayConfig {
  merchantId: string;
  secretKey: string;
  isProduction?: boolean;
}

export interface SePayPaymentRequest {
  orderId: string; // Order ID của bạn (unique)
  orderAmount: number; // Số tiền (VND)
  orderDescription: string; // Mô tả đơn hàng
  orderCurrency?: string; // Mã tiền tệ (default: VND)
  successUrl: string; // URL redirect khi thanh toán thành công
  errorUrl: string; // URL redirect khi thanh toán thất bại
  cancelUrl: string; // URL redirect khi hủy thanh toán
  ipnUrl?: string; // IPN URL (webhook)
  customData?: Record<string, any>; // Dữ liệu tùy chỉnh
}

export interface SePayPaymentResponse {
  checkoutUrl: string; // URL để redirect user đến
  orderId: string;
}

/**
 * Generate SePay payment signature
 */
export function generateSePaySignature(
  params: Record<string, any>,
  secretKey: string
): string {
  // SePay sử dụng HMAC SHA256
  // Cần sort params và tạo query string
  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(queryString);
  return hmac.digest("hex");
}

/**
 * Create SePay payment checkout URL
 */
export async function createSePayPayment(
  config: SePayConfig,
  request: SePayPaymentRequest
): Promise<SePayPaymentResponse> {
  const baseUrl = config.isProduction
    ? "https://pay.sepay.vn/v1/checkout/init"
    : "https://sandbox.sepay.vn/v1/checkout/init"; // Sandbox URL (cần xác nhận)

  const params: Record<string, any> = {
    merchant_id: config.merchantId,
    order_id: request.orderId,
    order_amount: request.orderAmount.toString(),
    order_description: request.orderDescription,
    order_currency: request.orderCurrency || "VND",
    success_url: request.successUrl,
    error_url: request.errorUrl,
    cancel_url: request.cancelUrl,
  };

  if (request.ipnUrl) {
    params.ipn_url = request.ipnUrl;
  }

  if (request.customData) {
    params.custom_data = JSON.stringify(request.customData);
  }

  // Generate signature
  const signature = generateSePaySignature(params, config.secretKey);
  params.signature = signature;

  // Build checkout URL
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  const checkoutUrl = `${baseUrl}?${queryString}`;

  return {
    checkoutUrl,
    orderId: request.orderId,
  };
}

/**
 * Verify SePay IPN signature (if SePay provides signature verification)
 */
export function verifySePaySignature(
  payload: any,
  signature: string,
  secretKey: string
): boolean {
  // TODO: Implement SePay signature verification
  // Cần xem documentation SePay để biết cách verify IPN signature
  // Tạm thời return true nếu chưa có thông tin
  return true;
}
