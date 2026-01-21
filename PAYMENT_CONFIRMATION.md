# Hướng dẫn xác nhận thanh toán

## Vấn đề
Sau khi người dùng chuyển tiền đến QR code, hệ thống cần xác nhận thanh toán để cập nhật số dư ví.

## Giải pháp đã triển khai

### 1. Tự động kiểm tra (Auto-polling)
- Hệ thống tự động kiểm tra thanh toán mỗi 5 giây
- Không cần thao tác thủ công

### 2. Nút "Kiểm tra thanh toán"
- Người dùng có thể nhấn nút "Kiểm tra thanh toán" để kiểm tra ngay lập tức
- Hữu ích khi đã chuyển tiền và muốn xác nhận ngay

### 3. Xác nhận từ Admin/Webhook

#### Cách 1: Sử dụng Browser Console (Development)
Mở browser console và chạy:

```javascript
// Xác nhận bằng nội dung chuyển khoản (description)
window.paymentUtils.confirmPaymentByDescription("Nap tien vao vi 1768815930428");

// Hoặc xác nhận bằng transaction ID
window.paymentUtils.confirmPaymentByTransactionId("deposit-1768815930428");
```

#### Cách 2: Sử dụng trong code (Admin Panel)
```typescript
import { confirmPaymentByDescription } from "@/lib/payment-utils";

// Xác nhận thanh toán
confirmPaymentByDescription("Nap tien vao vi 1768815930428");
```

#### Cách 3: Tích hợp với Backend API (Production)
Trong production, bạn cần:

1. Tạo API endpoint để kiểm tra thanh toán từ ngân hàng
2. Cập nhật hàm `checkPayment()` trong `topup-modal.tsx` để gọi API thay vì kiểm tra localStorage
3. Tích hợp webhook từ ngân hàng để tự động xác nhận

Ví dụ cập nhật `checkPayment()`:
```typescript
const checkPayment = async () => {
  // ... existing code ...
  
  try {
    // Gọi API để kiểm tra thanh toán
    const response = await fetch(`/api/payments/check?transactionId=${transactionId}`);
    const data = await response.json();
    
    if (data.confirmed) {
      deposit(qrAmount, transactionId);
      setPaymentStatus("completed");
      // ...
    }
  } catch (error) {
    // Handle error
  }
};
```

## Xác nhận thanh toán ngay bây giờ

Nếu bạn vừa chuyển tiền và muốn xác nhận ngay:

1. Mở Browser Console (F12)
2. Chạy lệnh sau (thay `1768815930428` bằng số trong nội dung chuyển khoản của bạn):
```javascript
window.paymentUtils.confirmPaymentByDescription("Nap tien vao vi 1768815930428");
```

3. Hoặc nhấn nút "Kiểm tra thanh toán" trong modal

## Lưu ý

- Trong môi trường production, cần tích hợp với API thực tế để kiểm tra thanh toán
- Hiện tại hệ thống sử dụng localStorage để lưu trữ, chỉ phù hợp cho development/testing
- Để xác nhận thanh toán tự động, cần tích hợp webhook từ ngân hàng hoặc payment gateway
