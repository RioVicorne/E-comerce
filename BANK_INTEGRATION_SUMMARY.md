# Tóm tắt: Tích hợp Webhook từ Ngân hàng

## ✅ Đã hoàn thành

### 1. Webhook Signature Verification
- ✅ `lib/webhook-utils.ts` - Utilities để verify signature
- ✅ Hỗ trợ HMAC SHA256 và SHA512
- ✅ Constant-time comparison để tránh timing attacks
- ✅ Configurable algorithm và header name

### 2. Webhook Handler
- ✅ `app/api/webhooks/bank-payment/route.ts` - Webhook endpoint
- ✅ Verify signature trước khi xử lý
- ✅ Tìm payment bằng description hoặc transactionId
- ✅ Verify amount và account number
- ✅ Cập nhật payment status và user balance
- ✅ Lưu webhook metadata

### 3. Test Tools
- ✅ `app/api/webhooks/test/route.ts` - Test endpoint (dev only)
- ✅ `scripts/test-webhook.sh` - Shell script để test
- ✅ `app/admin/webhooks/page.tsx` - Admin panel để test webhook

### 4. Documentation
- ✅ `BANK_WEBHOOK_INTEGRATION.md` - Hướng dẫn chi tiết
- ✅ `BANK_INTEGRATION_SUMMARY.md` - Tóm tắt (file này)

## 🔐 Security Features

1. **Signature Verification**
   - Verify HMAC SHA256 signature từ ngân hàng
   - Constant-time comparison
   - Configurable algorithm

2. **Data Validation**
   - Verify amount matches
   - Verify account number matches
   - Check payment exists và status

3. **Error Handling**
   - Log tất cả errors
   - Return appropriate HTTP status codes
   - Không expose sensitive information

## 📁 Files Created/Updated

```
KeyWebSite/
├── lib/
│   └── webhook-utils.ts              ✅ NEW - Signature verification
├── app/
│   ├── api/
│   │   └── webhooks/
│   │       ├── bank-payment/
│   │       │   └── route.ts          ✅ UPDATED - With signature verification
│   │       └── test/
│   │           └── route.ts          ✅ NEW - Test endpoint
│   └── admin/
│       └── webhooks/
│           └── page.tsx              ✅ NEW - Admin panel
├── scripts/
│   └── test-webhook.sh               ✅ NEW - Test script
└── BANK_WEBHOOK_INTEGRATION.md       ✅ NEW - Documentation
```

## 🚀 Setup Instructions

### 1. Environment Variables

Thêm vào `.env`:

```bash
BANK_WEBHOOK_SECRET=your_secret_key_from_bank
BANK_WEBHOOK_ALGORITHM=sha256  # optional
BANK_WEBHOOK_HEADER=x-signature  # optional
```

### 2. Đăng ký với Ngân hàng

1. Liên hệ ngân hàng để đăng ký webhook
2. Cung cấp URL: `https://yoursite.com/api/webhooks/bank-payment`
3. Nhận secret key từ ngân hàng
4. Set environment variable

### 3. Test

**Cách 1: Admin Panel**
1. Vào `/admin/webhooks`
2. Nhấn "Test Webhook"
3. Xem kết quả

**Cách 2: Script**
```bash
./scripts/test-webhook.sh "Nap tien vao vi 1768815930428" 50000
```

**Cách 3: Manual**
```bash
curl -X POST http://localhost:3000/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"description": "Nap tien vao vi 1768815930428", "amount": 50000}'
```

## 🔄 Flow hoạt động

```
User chuyển tiền
    ↓
Ngân hàng xử lý
    ↓
Ngân hàng gửi webhook
    POST /api/webhooks/bank-payment
    Headers: x-signature: sha256=...
    Body: { description, amount, ... }
    ↓
Backend verify signature
    ↓
Tìm payment bằng description
    ↓
Verify amount & account
    ↓
Cập nhật payment → "completed"
    ↓
Cập nhật user balance
    ↓
Frontend auto-polling phát hiện
    ↓
Hiển thị thành công
```

## 📊 Webhook Format

### Input (từ ngân hàng):
```json
{
  "description": "Nap tien vao vi 1768815930428",
  "amount": 50000,
  "transactionId": "TXN123456",
  "accountNumber": "1105200789",
  "timestamp": "2026-01-13T14:30:00Z",
  "status": "success"
}
```

### Headers:
```
x-signature: sha256=abc123...
Content-Type: application/json
```

### Output:
```json
{
  "success": true,
  "message": "Thanh toán đã được xác nhận",
  "payment": {
    "id": "...",
    "transactionId": "..."
  }
}
```

## 🧪 Testing Checklist

- [ ] Test với signature hợp lệ → Success
- [ ] Test với signature không hợp lệ → 401
- [ ] Test với payment không tồn tại → 404
- [ ] Test với amount không khớp → 400
- [ ] Test với account number không khớp → 400
- [ ] Test duplicate webhook → Idempotent (không duplicate)

## 🔒 Security Checklist

- [x] Signature verification
- [x] Amount validation
- [x] Account number validation
- [x] Payment status check
- [x] Error logging
- [ ] Rate limiting (TODO)
- [ ] IP whitelisting (TODO - nếu ngân hàng cung cấp)
- [ ] Request timeout (TODO)

## 📝 Notes

1. **Signature Format**: Hầu hết ngân hàng sử dụng `sha256=...` format
2. **Payload**: Có thể khác nhau tùy ngân hàng, cần customize
3. **HTTPS**: Bắt buộc cho production
4. **Idempotency**: Đã xử lý - duplicate webhooks không tạo duplicate payments

## 🎯 Next Steps

1. **Đăng ký với ngân hàng** - Liên hệ để đăng ký webhook
2. **Test với ngân hàng** - Sử dụng test mode của ngân hàng
3. **Monitor** - Setup logging và monitoring
4. **Customize** - Điều chỉnh format nếu ngân hàng khác format chuẩn

## 🆘 Troubleshooting

Xem `BANK_WEBHOOK_INTEGRATION.md` để biết chi tiết về:
- Common issues
- Debugging steps
- Customization guide

---

**Hệ thống đã sẵn sàng để tích hợp với ngân hàng!** 🎉

Chỉ cần:
1. Set `BANK_WEBHOOK_SECRET`
2. Đăng ký webhook URL với ngân hàng
3. Test và deploy!
