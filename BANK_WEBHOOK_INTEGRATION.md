# Hướng dẫn tích hợp Webhook từ Ngân hàng

## 📋 Tổng quan

Hệ thống hỗ trợ nhận webhook từ ngân hàng để tự động xác nhận thanh toán. Khi người dùng chuyển tiền, ngân hàng sẽ gửi POST request đến webhook URL của bạn, và hệ thống sẽ tự động cập nhật số dư.

## 🔐 Bảo mật

### Signature Verification

Tất cả webhook từ ngân hàng đều được xác minh bằng chữ ký HMAC SHA256 để đảm bảo:
- ✅ Request thực sự đến từ ngân hàng
- ✅ Dữ liệu không bị thay đổi
- ✅ Tránh replay attacks

### Cách hoạt động:

1. Ngân hàng tạo signature từ payload + secret key
2. Gửi signature trong header `x-signature`
3. Backend verify signature trước khi xử lý

## ⚙️ Setup

### Bước 1: Nhận thông tin từ ngân hàng

Khi đăng ký webhook với ngân hàng, bạn sẽ nhận được:
- **Webhook URL**: URL để ngân hàng gửi request đến
- **Secret Key**: Key để verify signature
- **Algorithm**: Thuật toán hash (thường là SHA256)

### Bước 2: Cấu hình Environment Variables

Thêm vào file `.env`:

```bash
# Webhook Secret từ ngân hàng
BANK_WEBHOOK_SECRET=your_secret_key_from_bank

# Algorithm (optional, default: sha256)
BANK_WEBHOOK_ALGORITHM=sha256

# Header name chứa signature (optional, default: x-signature)
BANK_WEBHOOK_HEADER=x-signature
```

### Bước 3: Đăng ký Webhook URL với ngân hàng

Webhook URL của bạn:
```
https://yoursite.com/api/webhooks/bank-payment
```

**Lưu ý:**
- URL phải là HTTPS (ngân hàng yêu cầu)
- URL phải accessible từ internet
- Có thể cần whitelist IP của ngân hàng

## 📨 Format Webhook từ Ngân hàng

### Format chuẩn (được hỗ trợ):

```json
{
  "description": "Nap tien vao vi 1768815930428",
  "amount": 50000,
  "transactionId": "TXN123456",
  "accountNumber": "1105200789",
  "timestamp": "2026-01-13T14:30:00Z",
  "status": "success",
  "bankTransactionId": "BANK-789012",
  "referenceNumber": "REF-345678"
}
```

### Các trường bắt buộc:
- `description`: Nội dung chuyển khoản (để match với payment)
- `amount`: Số tiền (để verify)

### Các trường tùy chọn:
- `transactionId`: Transaction ID từ ngân hàng
- `accountNumber`: Số tài khoản nhận
- `timestamp`: Thời gian giao dịch
- `status`: Trạng thái ("success", "completed", etc.)
- `bankTransactionId`: ID giao dịch từ ngân hàng
- `referenceNumber`: Số tham chiếu

## 🔄 Flow hoạt động

```
1. User tạo QR code → Payment record được tạo (status: pending)
   ↓
2. User chuyển tiền qua app ngân hàng
   ↓
3. Ngân hàng xử lý giao dịch
   ↓
4. Ngân hàng gửi webhook → POST /api/webhooks/bank-payment
   Headers:
     x-signature: sha256=abc123...
   Body:
     {
       "description": "Nap tien vao vi 1768815930428",
       "amount": 50000,
       ...
     }
   ↓
5. Backend verify signature
   ↓
6. Tìm payment bằng description hoặc transactionId
   ↓
7. Verify amount và account number
   ↓
8. Cập nhật payment status → "completed"
   ↓
9. Cập nhật user balance (nếu có userId)
   ↓
10. Frontend auto-polling phát hiện → Hiển thị thành công
```

## 🧪 Testing

### Cách 1: Sử dụng Test Endpoint

```bash
# Test webhook với signature tự động
curl -X POST http://localhost:3000/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Nap tien vao vi 1768815930428",
    "amount": 50000,
    "transactionId": "TXN123456"
  }'
```

### Cách 2: Test thủ công với signature

```bash
# 1. Tạo payment trước
# 2. Generate signature
node -e "
const crypto = require('crypto');
const payload = JSON.stringify({
  description: 'Nap tien vao vi 1768815930428',
  amount: 50000
});
const secret = 'your_secret_key';
const hmac = crypto.createHmac('sha256', secret);
hmac.update(payload);
console.log('sha256=' + hmac.digest('hex'));
"

# 3. Gửi webhook với signature
curl -X POST http://localhost:3000/api/webhooks/bank-payment \
  -H "Content-Type: application/json" \
  -H "x-signature: sha256=abc123..." \
  -d '{
    "description": "Nap tien vao vi 1768815930428",
    "amount": 50000
  }'
```

### Cách 3: Sử dụng Postman/Insomnia

1. Tạo POST request đến `http://localhost:3000/api/webhooks/bank-payment`
2. Headers:
   - `Content-Type: application/json`
   - `x-signature: sha256=...` (generate từ payload)
3. Body: JSON với description và amount

## 🔍 Debugging

### Kiểm tra logs

Webhook handler sẽ log:
- ✅ Signature verification success/failure
- ✅ Payment found/not found
- ✅ Amount/account verification
- ✅ Update success/failure

### Common Issues

#### 1. "Invalid signature"
**Nguyên nhân:**
- Secret key không đúng
- Algorithm không khớp
- Payload bị thay đổi

**Giải pháp:**
- Kiểm tra `BANK_WEBHOOK_SECRET` trong `.env`
- Kiểm tra algorithm trong header và config
- Đảm bảo payload giống hệt khi tạo signature

#### 2. "Payment not found"
**Nguyên nhân:**
- Description không khớp
- Payment đã được xác nhận
- Payment chưa được tạo

**Giải pháp:**
- Kiểm tra description trong webhook có khớp với payment không
- Kiểm tra payment status trong database
- Đảm bảo payment đã được tạo trước khi chuyển tiền

#### 3. "Amount mismatch"
**Nguyên nhân:**
- Số tiền trong webhook khác với payment

**Giải pháp:**
- Kiểm tra amount trong webhook
- Kiểm tra amount trong payment record

## 📊 Monitoring

### Webhook Logs

Tất cả webhook requests được log với:
- Timestamp
- Signature status
- Payment ID
- Status (success/failure)

### Database

Kiểm tra `Payment` table:
- `status`: "completed" nếu webhook thành công
- `confirmedBy`: "webhook"
- `metadata`: Chứa toàn bộ webhook payload

## 🔒 Security Best Practices

1. **Luôn verify signature** - Không bao giờ disable trong production
2. **Sử dụng HTTPS** - Bắt buộc cho webhook URL
3. **Whitelist IP** - Nếu ngân hàng cung cấp IP range
4. **Rate limiting** - Giới hạn số request từ một IP
5. **Idempotency** - Xử lý duplicate webhooks (đã có sẵn)
6. **Logging** - Log tất cả webhook requests để audit

## 🚀 Production Checklist

- [ ] Set `BANK_WEBHOOK_SECRET` trong production environment
- [ ] Đăng ký webhook URL với ngân hàng
- [ ] Test webhook với ngân hàng (test mode)
- [ ] Verify signature verification hoạt động
- [ ] Setup monitoring và alerts
- [ ] Document webhook format từ ngân hàng
- [ ] Setup backup/retry mechanism (nếu cần)

## 📝 Ví dụ tích hợp với các ngân hàng

### VPBank

```json
{
  "transactionId": "VPB-TXN-123456",
  "amount": 50000,
  "description": "Nap tien vao vi 1768815930428",
  "accountNumber": "1105200789",
  "timestamp": "2026-01-13T14:30:00Z"
}
```

### Vietcombank

```json
{
  "refNo": "VCB-REF-789012",
  "amount": 50000,
  "content": "Nap tien vao vi 1768815930428",
  "account": "1105200789",
  "transDate": "2026-01-13T14:30:00Z"
}
```

**Lưu ý:** Format có thể khác nhau tùy ngân hàng. Cần điều chỉnh webhook handler cho phù hợp.

## 🛠️ Customization

Nếu ngân hàng của bạn có format khác, cập nhật `app/api/webhooks/bank-payment/route.ts`:

```typescript
// Map fields từ ngân hàng sang format chuẩn
const description = body.content || body.description || body.transferContent;
const amount = body.amount || body.transAmount;
const transactionId = body.transactionId || body.refNo || body.txnId;
```

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong console
2. Kiểm tra database để xem payment status
3. Test với `/api/webhooks/test` endpoint
4. Liên hệ ngân hàng để xác nhận webhook format
