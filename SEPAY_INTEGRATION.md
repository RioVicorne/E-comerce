# Hướng dẫn tích hợp SePay Payment Gateway

## 📋 Tổng quan

SePay là một cổng thanh toán Việt Nam hỗ trợ thanh toán qua QR code chuyển khoản ngân hàng. Hệ thống đã được tích hợp để hỗ trợ SePay IPN (Instant Payment Notification).

**Documentation:** https://developer.sepay.vn/vi/cong-thanh-toan/bat-dau

## 🚀 Setup

### Bước 1: Đăng ký tài khoản SePay

1. Truy cập https://my.sepay.vn/register
2. Đăng ký tài khoản
3. Chọn gói dịch vụ phù hợp
4. Kích hoạt "Cổng thanh toán" → "Quét mã QR chuyển khoản ngân hàng"

### Bước 2: Lấy thông tin tích hợp

Sau khi đăng ký, bạn sẽ nhận được:
- **MERCHANT ID**: ID của merchant
- **SECRET KEY**: Key để tạo signature

### Bước 3: Cấu hình Environment Variables

Thêm vào file `.env`:

```bash
# SePay Configuration
SEPAY_MERCHANT_ID=your_merchant_id
SEPAY_SECRET_KEY=your_secret_key
SEPAY_ENV=sandbox  # hoặc "production"

# Base URL cho callbacks
NEXT_PUBLIC_BASE_URL=https://yoursite.com
```

### Bước 4: Cấu hình IPN URL

1. Đăng nhập vào https://my.sepay.vn
2. Vào mục "Cổng thanh toán" → "Cấu hình IPN"
3. Điền IPN URL: `https://yoursite.com/api/webhooks/sepay`
4. Lưu cấu hình

## 🔄 Flow hoạt động

```
1. User tạo payment request
   ↓
2. Backend tạo payment record (status: pending)
   ↓
3. Backend gọi SePay API để tạo checkout URL
   ↓
4. Frontend redirect user đến SePay checkout page
   ↓
5. User quét QR và thanh toán
   ↓
6. SePay xử lý thanh toán
   ↓
7. SePay gửi IPN → POST /api/webhooks/sepay
   ↓
8. Backend xử lý IPN:
   - Verify notification_type = "ORDER_PAID"
   - Verify transaction_status = "APPROVED"
   - Tìm payment bằng order_id hoặc description
   - Cập nhật payment status → "completed"
   - Cập nhật user balance
   ↓
9. SePay redirect user về success_url
   ↓
10. Frontend hiển thị thành công
```

## 📨 SePay IPN Format

### Request từ SePay:

```json
{
  "timestamp": 1759134682,
  "notification_type": "ORDER_PAID",
  "order": {
    "id": "e2c195be-c721-47eb-b323-99ab24e52d85",
    "order_id": "deposit-1768815930428",
    "order_status": "CAPTURED",
    "order_currency": "VND",
    "order_amount": "50000.00",
    "order_invoice_number": "INV-1759134677",
    "order_description": "Nap tien vao vi 1768815930428"
  },
  "transaction": {
    "id": "384c66dd-41e6-4316-a544-b4141682595c",
    "payment_method": "BANK_TRANSFER",
    "transaction_id": "68da43da2d9de",
    "transaction_status": "APPROVED",
    "transaction_amount": "50000",
    "transaction_currency": "VND"
  }
}
```

### Response (phải return 200):

```json
{
  "success": true,
  "message": "Thanh toán đã được xác nhận"
}
```

## 🧪 Testing

### Sandbox Mode

1. Set `SEPAY_ENV=sandbox` trong `.env`
2. Sử dụng Sandbox Merchant ID và Secret Key
3. Test với SePay Sandbox environment

### Test IPN

Bạn có thể test IPN bằng cách gửi request thủ công:

```bash
curl -X POST http://localhost:3000/api/webhooks/sepay \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": 1759134682,
    "notification_type": "ORDER_PAID",
    "order": {
      "order_id": "deposit-1768815930428",
      "order_status": "CAPTURED",
      "order_amount": "50000.00",
      "order_description": "Nap tien vao vi 1768815930428"
    },
    "transaction": {
      "transaction_status": "APPROVED",
      "transaction_amount": "50000"
    }
  }'
```

## 🔐 Security

### Signature Verification

SePay có thể yêu cầu verify signature cho IPN. Hiện tại handler chưa implement signature verification vì cần documentation chính xác từ SePay.

**TODO:** Implement signature verification khi có thông tin từ SePay.

### Best Practices

1. **HTTPS**: Bắt buộc cho production
2. **Idempotency**: Handler đã xử lý duplicate IPN
3. **Validation**: Verify amount, status trước khi cập nhật
4. **Logging**: Log tất cả IPN để audit

## 📝 API Endpoints

### 1. Tạo Payment với SePay

```typescript
POST /api/payments/sepay/create

Request:
{
  "amount": 50000,
  "description": "Nap tien vao vi 1768815930428",
  "userId": "user-id", // optional
  "successUrl": "https://yoursite.com/payment/success",
  "errorUrl": "https://yoursite.com/payment/error",
  "cancelUrl": "https://yoursite.com/payment/cancel"
}

Response:
{
  "success": true,
  "payment": {
    "id": "...",
    "transactionId": "deposit-1768815930428",
    "amount": 50000,
    "status": "pending"
  },
  "checkoutUrl": "https://pay.sepay.vn/v1/checkout/init?..."
}
```

### 2. SePay IPN Webhook

```
POST /api/webhooks/sepay
```

Tự động được gọi bởi SePay khi có giao dịch.

## 🔄 So sánh với Ngân hàng trực tiếp

| Tính năng | Ngân hàng trực tiếp | SePay Gateway |
|-----------|---------------------|---------------|
| **Setup** | Phức tạp (cần đăng ký với ngân hàng) | Đơn giản (đăng ký online) |
| **Phí** | Thấp | Có phí (1-3%) |
| **Tốc độ** | Rất nhanh | Nhanh |
| **Hỗ trợ** | Phụ thuộc ngân hàng | SePay hỗ trợ |
| **QR Code** | Tự tạo | SePay cung cấp |
| **Webhook** | Tùy ngân hàng | IPN chuẩn |

## 🎯 Sử dụng trong Frontend

### Cách 1: Sử dụng API

```typescript
const response = await fetch("/api/payments/sepay/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 50000,
    description: "Nap tien vao vi 1768815930428",
  }),
});

const data = await response.json();
if (data.success) {
  // Redirect user đến SePay checkout
  window.location.href = data.checkoutUrl;
}
```

### Cách 2: Tích hợp vào TopUpModal

Có thể cập nhật `topup-modal.tsx` để hỗ trợ SePay như một phương thức thanh toán.

## 📊 Monitoring

### Kiểm tra Payments

Vào Admin Panel → Payments để xem:
- Payments được tạo qua SePay (bankName = "SePay")
- Status: pending → completed
- Metadata chứa SePay order ID và transaction ID

### Logs

Tất cả IPN requests được log với:
- Timestamp
- Order ID
- Transaction ID
- Status (success/failure)

## 🚀 Production Checklist

- [ ] Đăng ký tài khoản SePay Production
- [ ] Set `SEPAY_ENV=production`
- [ ] Cập nhật Merchant ID và Secret Key
- [ ] Cấu hình IPN URL trong SePay dashboard
- [ ] Test với SePay Sandbox trước
- [ ] Setup monitoring và alerts
- [ ] Implement signature verification (nếu SePay yêu cầu)

## 🆘 Troubleshooting

### IPN không nhận được

1. Kiểm tra IPN URL đã cấu hình đúng trong SePay dashboard
2. Kiểm tra server có accessible từ internet không
3. Kiểm tra logs để xem có request đến không

### Payment không được cập nhật

1. Kiểm tra order_id có khớp với transactionId không
2. Kiểm tra description có khớp không
3. Kiểm tra amount có khớp không
4. Xem logs để biết lỗi cụ thể

## 📞 Support

- SePay Documentation: https://developer.sepay.vn
- SePay Dashboard: https://my.sepay.vn
- Support: Liên hệ SePay support

---

**Hệ thống đã sẵn sàng để tích hợp với SePay!** 🎉
