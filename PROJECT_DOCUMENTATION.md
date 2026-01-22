

--------------------------------------------------------------------------------
# SOURCE FILE: README.md
--------------------------------------------------------------------------------

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


--------------------------------------------------------------------------------
# SOURCE FILE: SETUP.md
--------------------------------------------------------------------------------

# Hướng dẫn Setup Hệ thống Thanh toán

## 📋 Bước 1: Cài đặt Dependencies

```bash
npm install
```

Hoặc nếu chưa có Prisma:

```bash
npm install @prisma/client
npm install -D prisma
```

## 📋 Bước 2: Setup Database

### 2.1. Tạo file `.env` (nếu chưa có)

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/keywebsite?schema=public"
```

**Lưu ý:** Thay đổi thông tin database cho phù hợp với hệ thống của bạn.

### 2.2. Chạy Prisma Migration

```bash
# Generate Prisma Client
npx prisma generate

# Tạo database và tables
npx prisma migrate dev --name init
```

Hoặc nếu database đã tồn tại:

```bash
# Push schema to database (không tạo migration)
npx prisma db push
```

## 📋 Bước 3: Kiểm tra Setup

### 3.1. Kiểm tra API Routes

Chạy development server:

```bash
npm run dev
```

Kiểm tra các API endpoints:

- `GET http://localhost:3000/api/payments/list` - Lấy danh sách payments
- `POST http://localhost:3000/api/payments/create` - Tạo payment mới
- `GET http://localhost:3000/api/payments/check?transactionId=xxx` - Kiểm tra payment
- `POST http://localhost:3000/api/payments/confirm` - Xác nhận payment

### 3.2. Kiểm tra Admin Panel

1. Truy cập: `http://localhost:3000/admin/payments`
2. Đăng nhập (nếu có authentication)
3. Kiểm tra xem có hiển thị danh sách payments không

## 📋 Bước 4: Test Flow

### 4.1. Test tạo QR code

1. Vào trang chủ
2. Nhấn "Nạp tiền"
3. Nhập số tiền (ví dụ: 50000)
4. Nhấn "Tạo mã QR thanh toán"
5. Kiểm tra xem QR code có hiển thị không

### 4.2. Test xác nhận thanh toán (Admin)

1. Vào Admin Panel → Payments
2. Tìm payment có status "pending"
3. Nhấn nút "Xác nhận"
4. Kiểm tra xem status có đổi thành "completed" không

### 4.3. Test auto-polling

1. Tạo QR code
2. Đợi 5 giây
3. Kiểm tra xem hệ thống có tự động kiểm tra không (xem Network tab trong DevTools)

## 🔧 Troubleshooting

### Lỗi: "PrismaClient is not configured"

**Giải pháp:**
```bash
npx prisma generate
```

### Lỗi: "Can't reach database server"

**Giải pháp:**
1. Kiểm tra file `.env` có đúng `DATABASE_URL` không
2. Kiểm tra database server có đang chạy không
3. Kiểm tra firewall/network

### Lỗi: "Table does not exist"

**Giải pháp:**
```bash
npx prisma migrate dev
# hoặc
npx prisma db push
```

### API trả về 500 error

**Giải pháp:**
1. Kiểm tra console log trong terminal
2. Kiểm tra database connection
3. Kiểm tra Prisma schema có đúng không

## 🚀 Production Setup

### 1. Environment Variables

Thêm vào Vercel/Production environment:

```
DATABASE_URL=your_production_database_url
```

### 2. Run Migrations

```bash
npx prisma migrate deploy
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## 📝 Lưu ý

1. **Database**: Hiện tại sử dụng PostgreSQL. Nếu muốn đổi sang MySQL/SQLite, cập nhật `prisma/schema.prisma`

2. **Authentication**: Hiện tại chưa có authentication cho API. Nên thêm authentication middleware trước khi deploy production.

3. **Webhook Security**: Trong production, cần xác minh chữ ký webhook từ ngân hàng để đảm bảo an toàn.

4. **Rate Limiting**: Nên thêm rate limiting cho API endpoints để tránh abuse.

## 🎯 Next Steps

1. ✅ Setup database
2. ✅ Test API endpoints
3. ✅ Test admin panel
4. ⏳ Thêm authentication
5. ⏳ Tích hợp webhook từ ngân hàng (nếu có)
6. ⏳ Thêm logging và monitoring


--------------------------------------------------------------------------------
# SOURCE FILE: IMPLEMENTATION_SUMMARY.md
--------------------------------------------------------------------------------

# Tóm tắt Implementation - Hệ thống Thanh toán

## ✅ Đã hoàn thành

### 1. Database Schema (Prisma)
- ✅ Thêm model `Payment` vào `prisma/schema.prisma`
- ✅ Các trường: transactionId, description, amount, status, bank info, timestamps
- ✅ Indexes cho performance

### 2. API Routes
- ✅ `POST /api/payments/create` - Tạo payment request mới
- ✅ `GET /api/payments/check` - Kiểm tra trạng thái thanh toán
- ✅ `POST /api/payments/confirm` - Xác nhận thanh toán (admin/webhook)
- ✅ `GET /api/payments/list` - Lấy danh sách payments (admin)
- ✅ `POST /api/webhooks/bank-payment` - Webhook handler từ ngân hàng

### 3. Frontend Updates
- ✅ Cập nhật `topup-modal.tsx`:
  - Gọi API khi tạo QR code
  - Gọi API khi kiểm tra thanh toán
  - Auto-polling mỗi 5 giây
  - Fallback về localStorage nếu API fail
  - Tạo QR mới khi expired

### 4. Admin Panel
- ✅ Cập nhật `app/admin/payments/page.tsx`:
  - Lấy dữ liệu từ API thay vì mock data
  - Hiển thị danh sách payments thực tế
  - Nút "Xác nhận" để admin xác nhận thanh toán
  - Auto-refresh mỗi 10 giây
  - Copy description để kiểm tra
  - Filter theo status

### 5. Utilities
- ✅ `lib/prisma.ts` - Prisma client singleton
- ✅ `lib/payment-utils.ts` - Utility functions (giữ lại cho backward compatibility)

### 6. Documentation
- ✅ `PAYMENT_INTEGRATION_GUIDE.md` - Giải thích 3 cách tích hợp
- ✅ `SETUP.md` - Hướng dẫn setup database và test
- ✅ `EXPLANATION.md` - Giải thích chi tiết hệ thống
- ✅ `PAYMENT_CONFIRMATION.md` - Hướng dẫn xác nhận thanh toán

## 📁 Cấu trúc Files

```
KeyWebSite/
├── app/
│   ├── api/
│   │   ├── payments/
│   │   │   ├── create/route.ts      ✅ Tạo payment
│   │   │   ├── check/route.ts       ✅ Kiểm tra payment
│   │   │   ├── confirm/route.ts     ✅ Xác nhận payment
│   │   │   └── list/route.ts        ✅ List payments
│   │   └── webhooks/
│   │       └── bank-payment/route.ts ✅ Webhook handler
│   └── admin/
│       └── payments/
│           └── page.tsx              ✅ Admin panel (updated)
├── components/
│   └── marketplace/
│       └── topup-modal.tsx           ✅ Updated to use API
├── lib/
│   ├── prisma.ts                     ✅ Prisma client
│   └── payment-utils.ts              ✅ Utilities (backward compat)
├── prisma/
│   └── schema.prisma                 ✅ Updated with Payment model
└── package.json                      ✅ Added @prisma/client
```

## 🔄 Flow hoạt động

### Flow 1: User tạo QR và thanh toán

```
1. User nhập số tiền → Nhấn "Tạo mã QR"
   ↓
2. Frontend gọi POST /api/payments/create
   ↓
3. Backend tạo Payment record (status: pending)
   ↓
4. Frontend hiển thị QR code
   ↓
5. User chuyển tiền qua app ngân hàng
   ↓
6. Frontend auto-polling mỗi 5 giây
   ↓
7. Admin xác nhận trong admin panel
   ↓
8. Backend cập nhật status → "completed"
   ↓
9. Frontend phát hiện → Cập nhật số dư → Hiển thị thành công
```

### Flow 2: Webhook từ ngân hàng

```
1. User chuyển tiền
   ↓
2. Ngân hàng gửi webhook → POST /api/webhooks/bank-payment
   ↓
3. Backend xác minh và cập nhật status → "completed"
   ↓
4. Frontend auto-polling phát hiện → Cập nhật số dư
```

### Flow 3: Admin xác nhận thủ công

```
1. Admin vào /admin/payments
   ↓
2. Tìm payment có status "pending"
   ↓
3. Kiểm tra tài khoản ngân hàng
   ↓
4. Nhấn nút "Xác nhận"
   ↓
5. Backend cập nhật status → "completed"
   ↓
6. Frontend auto-polling phát hiện → Cập nhật số dư
```

## 🎯 Tính năng

### ✅ Đã có
- Tạo payment request qua API
- Lưu trữ trong database
- Auto-polling để kiểm tra thanh toán
- Admin panel để xác nhận thủ công
- Webhook handler (sẵn sàng tích hợp)
- Fallback về localStorage nếu API fail
- Auto-refresh admin panel

### ⏳ Cần làm thêm (Optional)
- Authentication cho API
- Rate limiting
- Webhook signature verification
- Email/SMS notification
- Dashboard với charts
- Export reports
- Tích hợp với payment gateway (VNPay, Momo...)

## 🚀 Next Steps

1. **Setup Database:**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   ```

2. **Test:**
   - Tạo QR code
   - Xác nhận trong admin panel
   - Kiểm tra auto-polling

3. **Production:**
   - Setup production database
   - Add authentication
   - Add webhook signature verification
   - Deploy

## 📝 Lưu ý

1. **Backward Compatibility**: Hệ thống vẫn hỗ trợ localStorage như fallback
2. **Error Handling**: Có try-catch và fallback ở mọi nơi
3. **Performance**: Có indexes trong database, auto-refresh có interval
4. **Security**: Cần thêm authentication và webhook verification cho production

## 🎉 Kết quả

Hệ thống hiện tại hỗ trợ **cả 3 cách tích hợp**:
1. ✅ **Tự quản lý** (Admin xác nhận) - Đã hoàn thành
2. ✅ **Webhook từ ngân hàng** - API sẵn sàng, chỉ cần tích hợp
3. ✅ **Payment Gateway** - Có thể thêm sau

Bạn có thể bắt đầu sử dụng ngay với cách 1 (Admin xác nhận), sau đó nâng cấp lên cách 2 hoặc 3 khi cần!


--------------------------------------------------------------------------------
# SOURCE FILE: EXPLANATION.md
--------------------------------------------------------------------------------

# Giải thích chi tiết: Hệ thống xác nhận thanh toán

## 📋 Vấn đề ban đầu

### Tình huống:
1. Người dùng tạo QR code để nạp tiền (ví dụ: 50.000₫)
2. Người dùng chuyển tiền đến tài khoản VPBank qua QR code
3. **VẤN ĐỀ**: Hệ thống không tự động phát hiện và xác nhận thanh toán
4. Số dư ví không được cập nhật mặc dù đã chuyển tiền

### Nguyên nhân:
- Hệ thống chỉ tạo QR code và hiển thị
- **KHÔNG CÓ** cơ chế kiểm tra thanh toán tự động
- **KHÔNG CÓ** cách để xác nhận thanh toán từ bên ngoài (admin/webhook)
- **KHÔNG CÓ** polling (kiểm tra định kỳ) để phát hiện thanh toán

---

## ✅ Giải pháp đã triển khai

### 1. **Hàm kiểm tra thanh toán (`checkPayment`)**

```typescript
const checkPayment = React.useCallback(async () => {
  // Kiểm tra nếu đang pending và có đủ thông tin
  if (paymentStatus !== "pending" || !transactionId || !qrDescription) {
    return;
  }

  // Đọc danh sách thanh toán đã được xác nhận từ localStorage
  const confirmedPayments = JSON.parse(
    localStorage.getItem("confirmedPayments") || "[]"
  );
  
  // Tìm xem có thanh toán nào khớp với transactionId hoặc description không
  const isConfirmed = confirmedPayments.some(
    (p) =>
      p.transactionId === transactionId || p.description === qrDescription
  );

  if (isConfirmed) {
    // Nếu đã xác nhận:
    // 1. Cập nhật số dư ví
    deposit(qrAmount, transactionId);
    // 2. Đổi trạng thái thành "completed"
    setPaymentStatus("completed");
    // 3. Xóa khỏi danh sách đã xác nhận (tránh xác nhận lại)
    // 4. Tự động đóng modal sau 2 giây
  }
}, [paymentStatus, transactionId, qrDescription, qrAmount, deposit]);
```

**Cách hoạt động:**
- Kiểm tra trong `localStorage` xem có thanh toán nào đã được xác nhận chưa
- So khớp bằng `transactionId` hoặc `description` (nội dung chuyển khoản)
- Nếu khớp → cập nhật số dư và hiển thị thành công

---

### 2. **Auto-polling (Tự động kiểm tra định kỳ)**

```typescript
// Auto-polling for payment status
React.useEffect(() => {
  if (qrGenerated && paymentStatus === "pending" && transactionId) {
    // Kiểm tra ngay lập tức
    checkPayment();
    
    // Sau đó kiểm tra mỗi 5 giây
    paymentCheckIntervalRef.current = setInterval(() => {
      checkPayment();
    }, PAYMENT_CHECK_INTERVAL_MS); // 5000ms = 5 giây
  }
  
  return () => {
    // Dọn dẹp khi component unmount hoặc điều kiện thay đổi
    if (paymentCheckIntervalRef.current) {
      clearInterval(paymentCheckIntervalRef.current);
    }
  };
}, [qrGenerated, paymentStatus, transactionId, checkPayment]);
```

**Cách hoạt động:**
- Khi QR được tạo và trạng thái là "pending"
- Hệ thống tự động gọi `checkPayment()` ngay lập tức
- Sau đó cứ mỗi 5 giây lại kiểm tra lại một lần
- Dừng khi thanh toán được xác nhận hoặc QR hết hạn

**Lợi ích:**
- Người dùng không cần làm gì, hệ thống tự động phát hiện
- Phát hiện nhanh (tối đa 5 giây sau khi admin xác nhận)

---

### 3. **Nút "Kiểm tra thanh toán" (Manual Check)**

```typescript
{!isPaid && !isExpired && (
  <Button
    variant="default"
    onClick={checkPayment}
    disabled={isCheckingPayment}
    className="flex-1"
  >
    {isCheckingPayment ? (
      <>
        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
        Đang kiểm tra...
      </>
    ) : (
      <>
        <RefreshCw className="h-3 w-3 mr-2" />
        Kiểm tra thanh toán
      </>
    )}
  </Button>
)}
```

**Cách hoạt động:**
- Người dùng nhấn nút → gọi `checkPayment()` ngay lập tức
- Hiển thị trạng thái "Đang kiểm tra..." khi đang xử lý
- Hữu ích khi người dùng muốn kiểm tra ngay mà không đợi 5 giây

---

### 4. **Lưu trữ thông tin giao dịch**

Khi tạo QR code:

```typescript
const handleGenerateQR = () => {
  const timestamp = Date.now();
  const description = `Nap tien vao vi ${timestamp}`;
  const txId = `deposit-${timestamp}`;
  
  // Lưu thông tin giao dịch vào localStorage
  const pendingTransactions = JSON.parse(
    localStorage.getItem("pendingTransactions") || "[]"
  );
  pendingTransactions.push({
    transactionId: txId,
    description,
    amount: numAmount,
    createdAt: timestamp,
  });
  localStorage.setItem("pendingTransactions", JSON.stringify(pendingTransactions));
};
```

**Mục đích:**
- Lưu lại thông tin giao dịch để đối chiếu sau
- Admin có thể xem danh sách giao dịch đang chờ xác nhận
- Có thể kiểm tra lại nếu cần

---

### 5. **Utility Functions (`lib/payment-utils.ts`)**

#### a. `confirmPaymentByDescription()`

```typescript
export function confirmPaymentByDescription(description: string): boolean {
  return confirmPayment({ description });
}
```

**Cách sử dụng:**
```javascript
// Trong browser console
window.paymentUtils.confirmPaymentByDescription("Nap tien vao vi 1768815930428");
```

**Cách hoạt động:**
1. Thêm thanh toán vào danh sách "confirmedPayments" trong localStorage
2. Dispatch event "paymentConfirmed" để thông báo cho component
3. Component lắng nghe event và tự động kiểm tra lại

#### b. `confirmPayment()`

```typescript
export function confirmPayment(
  identifier: { transactionId?: string; description?: string },
  amount?: number
): boolean {
  // 1. Đọc danh sách đã xác nhận
  const confirmedPayments = JSON.parse(
    localStorage.getItem("confirmedPayments") || "[]"
  );

  // 2. Kiểm tra xem đã xác nhận chưa (tránh trùng lặp)
  const alreadyConfirmed = confirmedPayments.some(/* ... */);
  if (alreadyConfirmed) return false;

  // 3. Thêm vào danh sách đã xác nhận
  confirmedPayments.push({
    transactionId: identifier.transactionId,
    description: identifier.description || "",
    amount,
    confirmedAt: Date.now(),
  });
  localStorage.setItem("confirmedPayments", JSON.stringify(confirmedPayments));

  // 4. Gửi event để component biết
  window.dispatchEvent(
    new CustomEvent("paymentConfirmed", {
      detail: identifier,
    })
  );

  return true;
}
```

---

### 6. **Event Listener (Lắng nghe sự kiện xác nhận)**

```typescript
// Listen for payment confirmation events
React.useEffect(() => {
  if (!qrGenerated || paymentStatus !== "pending" || !qrDescription) {
    return;
  }

  const handlePaymentConfirmed = (event: CustomEvent) => {
    const identifier = event.detail;
    // Kiểm tra xem có phải giao dịch của mình không
    if (
      identifier.transactionId === transactionId ||
      identifier.description === qrDescription
    ) {
      // Nếu đúng, kiểm tra lại ngay lập tức
      checkPayment();
    }
  };

  window.addEventListener("paymentConfirmed", handlePaymentConfirmed);
  
  return () => {
    window.removeEventListener("paymentConfirmed", handlePaymentConfirmed);
  };
}, [qrGenerated, paymentStatus, qrDescription, transactionId, checkPayment]);
```

**Cách hoạt động:**
- Khi admin gọi `confirmPaymentByDescription()`, nó dispatch event "paymentConfirmed"
- Component lắng nghe event này
- Nếu event khớp với giao dịch hiện tại → gọi `checkPayment()` ngay lập tức
- **Kết quả**: Phát hiện thanh toán ngay lập tức, không cần đợi 5 giây

---

## 🔄 Flow hoạt động hoàn chỉnh

### Bước 1: Người dùng tạo QR code
```
1. Nhập số tiền: 50.000₫
2. Nhấn "Tạo mã QR thanh toán"
3. Hệ thống tạo:
   - transactionId: "deposit-1768815930428"
   - description: "Nap tien vao vi 1768815930428"
   - Lưu vào localStorage (pendingTransactions)
4. Hiển thị QR code với thông tin trên
```

### Bước 2: Người dùng chuyển tiền
```
1. Quét QR code bằng app ngân hàng
2. Xác nhận chuyển 50.000₫
3. Nội dung chuyển khoản: "Nap tien vao vi 1768815930428"
4. Hoàn tất chuyển tiền
```

### Bước 3: Hệ thống tự động kiểm tra
```
1. Auto-polling chạy mỗi 5 giây
2. Mỗi lần kiểm tra:
   - Đọc localStorage "confirmedPayments"
   - Tìm xem có description "Nap tien vao vi 1768815930428" không
   - Nếu chưa có → tiếp tục chờ
   - Nếu có → bước 4
```

### Bước 4: Admin xác nhận thanh toán
```
Cách 1: Browser Console
  window.paymentUtils.confirmPaymentByDescription("Nap tien vao vi 1768815930428");

Cách 2: Trong code
  import { confirmPaymentByDescription } from "@/lib/payment-utils";
  confirmPaymentByDescription("Nap tien vao vi 1768815930428");
```

### Bước 5: Hệ thống phát hiện và xử lý
```
1. confirmPaymentByDescription() được gọi
2. Thêm vào localStorage "confirmedPayments"
3. Dispatch event "paymentConfirmed"
4. Component lắng nghe event → gọi checkPayment() ngay lập tức
5. checkPayment() tìm thấy trong "confirmedPayments"
6. Cập nhật số dư: deposit(50000, "deposit-1768815930428")
7. Đổi trạng thái: "pending" → "completed"
8. Hiển thị: "Nạp tiền thành công!"
9. Tự động đóng modal sau 2 giây
```

---

## 📊 Cấu trúc dữ liệu trong localStorage

### `pendingTransactions` (Giao dịch đang chờ)
```json
[
  {
    "transactionId": "deposit-1768815930428",
    "description": "Nap tien vao vi 1768815930428",
    "amount": 50000,
    "createdAt": 1768815930428
  }
]
```

### `confirmedPayments` (Giao dịch đã xác nhận)
```json
[
  {
    "transactionId": "deposit-1768815930428",
    "description": "Nap tien vao vi 1768815930428",
    "amount": 50000,
    "confirmedAt": 1768816000000
  }
]
```

---

## 🎯 Các cách xác nhận thanh toán

### Cách 1: Tự động (Auto-polling)
- ✅ Tự động kiểm tra mỗi 5 giây
- ✅ Không cần thao tác
- ⏱️ Phát hiện trong vòng 5 giây sau khi admin xác nhận

### Cách 2: Nút "Kiểm tra thanh toán"
- ✅ Người dùng chủ động kiểm tra
- ✅ Phát hiện ngay lập tức
- 👆 Cần nhấn nút

### Cách 3: Browser Console (Cho admin)
```javascript
// Xác nhận bằng description
window.paymentUtils.confirmPaymentByDescription("Nap tien vao vi 1768815930428");

// Xác nhận bằng transactionId
window.paymentUtils.confirmPaymentByTransactionId("deposit-1768815930428");
```

### Cách 4: Trong code (Cho admin panel)
```typescript
import { confirmPaymentByDescription } from "@/lib/payment-utils";

// Trong admin panel, khi admin xác nhận thanh toán
confirmPaymentByDescription("Nap tien vao vi 1768815930428");
```

---

## ⚠️ Lưu ý quan trọng

### 1. **Hiện tại sử dụng localStorage**
- ✅ Phù hợp cho development/testing
- ❌ Không phù hợp cho production
- ❌ Dữ liệu chỉ tồn tại trên trình duyệt hiện tại
- ❌ Không đồng bộ giữa các thiết bị

### 2. **Cần tích hợp API thực tế trong production**

Thay đổi hàm `checkPayment()`:

```typescript
const checkPayment = async () => {
  try {
    // Gọi API backend để kiểm tra thanh toán
    const response = await fetch(
      `/api/payments/check?transactionId=${transactionId}`
    );
    const data = await response.json();
    
    if (data.confirmed) {
      deposit(qrAmount, transactionId);
      setPaymentStatus("completed");
      // ...
    }
  } catch (error) {
    console.error("Error checking payment:", error);
  }
};
```

### 3. **Tích hợp webhook từ ngân hàng**

Khi ngân hàng gửi webhook xác nhận thanh toán:

```typescript
// API route: /api/webhooks/bank-payment
export async function POST(request: Request) {
  const { description, amount } = await request.json();
  
  // Xác nhận thanh toán
  confirmPaymentByDescription(description);
  
  return Response.json({ success: true });
}
```

---

## 🔍 Debug và kiểm tra

### Xem danh sách giao dịch đang chờ:
```javascript
window.paymentUtils.getPendingTransactions();
```

### Xem danh sách giao dịch đã xác nhận:
```javascript
window.paymentUtils.getConfirmedPayments();
```

### Xóa dữ liệu test:
```javascript
window.paymentUtils.clearConfirmedPayments();
window.paymentUtils.clearPendingTransactions();
```

---

## 📝 Tóm tắt

**Trước đây:**
- ❌ Không có cơ chế kiểm tra thanh toán
- ❌ Người dùng chuyển tiền nhưng hệ thống không biết
- ❌ Phải xác nhận thủ công bằng cách nào đó

**Bây giờ:**
- ✅ Tự động kiểm tra mỗi 5 giây
- ✅ Nút kiểm tra thủ công
- ✅ Admin có thể xác nhận từ console/code
- ✅ Phát hiện ngay lập tức khi admin xác nhận
- ✅ Cập nhật số dư tự động
- ✅ Hiển thị thông báo thành công

**Cần làm thêm (cho production):**
- 🔄 Tích hợp API backend thực tế
- 🔄 Tích hợp webhook từ ngân hàng
- 🔄 Lưu trữ dữ liệu trong database thay vì localStorage


--------------------------------------------------------------------------------
# SOURCE FILE: PAYMENT_INTEGRATION_GUIDE.md
--------------------------------------------------------------------------------

# Hướng dẫn tích hợp thanh toán - 3 cách

## 📚 Giải thích 3 cách tích hợp

### 1. 🏦 Tích hợp với Ngân hàng trực tiếp (Bank Webhook)

#### Cách hoạt động:
```
1. Ngân hàng cung cấp webhook URL
2. Khi có giao dịch chuyển tiền → Ngân hàng gửi POST request đến webhook
3. Backend nhận webhook → Xác minh → Cập nhật database
4. Frontend polling hoặc real-time update
```

#### Ưu điểm:
- ✅ Tự động hoàn toàn
- ✅ Xác nhận nhanh (vài giây sau khi chuyển tiền)
- ✅ Không cần admin can thiệp

#### Nhược điểm:
- ❌ Cần đăng ký với ngân hàng
- ❌ Cần có tài khoản doanh nghiệp
- ❌ Phức tạp hơn về kỹ thuật
- ❌ Cần xác minh webhook (security)

#### Yêu cầu:
- Tài khoản doanh nghiệp tại ngân hàng
- Đăng ký webhook với ngân hàng
- SSL certificate (HTTPS)
- Xác minh chữ ký webhook

#### Ví dụ webhook từ ngân hàng:
```json
POST /api/webhooks/bank-payment
{
  "transactionId": "TXN123456",
  "amount": 50000,
  "description": "Nap tien vao vi 1768815930428",
  "accountNumber": "1105200789",
  "timestamp": "2026-01-13T14:30:00Z",
  "signature": "abc123..." // Để xác minh
}
```

---

### 2. 💳 Tích hợp với Payment Gateway (VNPay, Momo, ZaloPay...)

#### Cách hoạt động:
```
1. Tích hợp SDK của payment gateway
2. Tạo payment request → Redirect đến gateway
3. User thanh toán trên gateway
4. Gateway redirect về + gửi webhook
5. Xác minh và cập nhật
```

#### Ưu điểm:
- ✅ Dễ tích hợp (có SDK sẵn)
- ✅ Hỗ trợ nhiều phương thức thanh toán
- ✅ Tự động xử lý
- ✅ Có dashboard quản lý

#### Nhược điểm:
- ❌ Phí giao dịch (thường 1-3%)
- ❌ Phụ thuộc vào bên thứ 3
- ❌ Cần đăng ký tài khoản merchant

#### Các Payment Gateway phổ biến ở Việt Nam:
- **VNPay**: Phổ biến nhất, hỗ trợ nhiều ngân hàng
- **Momo**: Ví điện tử, thanh toán nhanh
- **ZaloPay**: Tích hợp với Zalo
- **PayPal**: Quốc tế

#### Ví dụ với VNPay:
```typescript
// Tạo payment URL
const paymentUrl = vnpay.createPaymentUrl({
  amount: 50000,
  orderId: "ORDER123",
  orderDescription: "Nạp tiền vào ví",
  returnUrl: "https://yoursite.com/payment/callback"
});

// Redirect user đến paymentUrl
// Sau khi thanh toán, VNPay redirect về returnUrl + gửi webhook
```

---

### 3. 👨‍💼 Hệ thống tự quản lý (Admin xác nhận thủ công)

#### Cách hoạt động:
```
1. User tạo QR code và chuyển tiền
2. Thông tin giao dịch lưu vào database (status: pending)
3. Admin kiểm tra tài khoản ngân hàng
4. Admin xác nhận trong admin panel
5. Hệ thống cập nhật số dư tự động
```

#### Ưu điểm:
- ✅ Không cần đăng ký với bên thứ 3
- ✅ Không mất phí giao dịch
- ✅ Kiểm soát hoàn toàn
- ✅ Dễ triển khai

#### Nhược điểm:
- ❌ Cần admin can thiệp thủ công
- ❌ Không tự động (phải kiểm tra tài khoản)
- ❌ Có thể chậm nếu admin không online

#### Phù hợp với:
- Startup nhỏ
- Giao dịch không quá nhiều
- Muốn tiết kiệm chi phí
- Cần kiểm soát chặt chẽ

---

## 🎯 So sánh 3 cách

| Tiêu chí | Ngân hàng trực tiếp | Payment Gateway | Tự quản lý |
|----------|---------------------|-----------------|------------|
| **Tự động** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Chi phí** | Thấp | Cao (1-3%) | Không |
| **Độ khó** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Tốc độ** | Rất nhanh | Rất nhanh | Phụ thuộc admin |
| **Bảo mật** | Cao | Cao | Trung bình |
| **Phù hợp** | Doanh nghiệp lớn | Mọi quy mô | Startup nhỏ |

---

## 💡 Khuyến nghị

### Giai đoạn 1: Startup/MVP
→ **Sử dụng cách 3 (Tự quản lý)**
- Dễ triển khai
- Không mất phí
- Đủ cho giao dịch ít

### Giai đoạn 2: Tăng trưởng
→ **Tích hợp Payment Gateway (VNPay/Momo)**
- Tự động hóa
- Hỗ trợ nhiều phương thức
- Trải nghiệm tốt hơn

### Giai đoạn 3: Quy mô lớn
→ **Tích hợp ngân hàng trực tiếp**
- Giảm chi phí
- Kiểm soát tốt hơn
- Tốc độ cao

---

## 🚀 Triển khai

Tôi sẽ tạo hệ thống hỗ trợ **cả 3 cách**:
1. ✅ API routes cho webhook (cách 1 & 2)
2. ✅ Admin panel để xác nhận thủ công (cách 3)
3. ✅ Frontend tự động polling
4. ✅ Database để lưu trữ giao dịch

Bạn có thể bắt đầu với cách 3, sau đó nâng cấp lên cách 1 hoặc 2 khi cần!


--------------------------------------------------------------------------------
# SOURCE FILE: PAYMENT_CONFIRMATION.md
--------------------------------------------------------------------------------

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


--------------------------------------------------------------------------------
# SOURCE FILE: BANK_INTEGRATION_SUMMARY.md
--------------------------------------------------------------------------------

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


--------------------------------------------------------------------------------
# SOURCE FILE: BANK_WEBHOOK_INTEGRATION.md
--------------------------------------------------------------------------------

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


--------------------------------------------------------------------------------
# SOURCE FILE: SEPAY_INTEGRATION.md
--------------------------------------------------------------------------------

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


--------------------------------------------------------------------------------
# SOURCE FILE: VERCEL_DEPLOYMENT.md
--------------------------------------------------------------------------------

# Deploying KeyWebSite to Vercel

## Prerequisites

- ✅ Next.js project (already set up)
- ✅ Git repository (already initialized)
- ✅ Vercel account (sign up at https://vercel.com)

---

## Method 1: Deploy via Vercel Dashboard (Recommended for Beginners)

### Step 1: Commit and Push Your Changes

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Add mobile-first responsive design with hamburger menu"

# Push to your remote repository
git push origin main
```

### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in (or create an account)
2. **Click "Add New..." → "Project"**
3. **Import your Git repository:**
   - If your repo is on GitHub/GitLab/Bitbucket, Vercel will show it
   - Click "Import" next to your `KeyWebSite` repository

### Step 3: Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Environment Variables (if needed)

If you have any environment variables (API keys, etc.):

- Click "Environment Variables"
- Add them here (e.g., `NEXT_PUBLIC_API_URL`, `DATABASE_URL`)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://keywebsite.vercel.app` (or a custom domain)

---

## Method 2: Deploy via Vercel CLI (For Developers)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project root directory
cd /home/khoatran/Workspaces/Projects/KeyWebSite

# Deploy to production
vercel --prod
```

The CLI will:

- Ask you to link the project (first time)
- Run the build
- Deploy to production
- Give you a URL

---

## Post-Deployment Checklist

### ✅ Verify Build Success

- Check the build logs in Vercel dashboard
- Ensure no errors occurred

### ✅ Test Your Site

- Visit the deployed URL
- Test mobile responsiveness
- Test all features (cart, navigation, etc.)

### ✅ Set Up Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### ✅ Configure Environment Variables (if needed)

- Go to Project Settings → Environment Variables
- Add any required variables for production

---

## Important Notes

### Build Configuration

Your `next.config.ts` is already configured correctly:

- ✅ Image domains configured (`img.vietqr.io`)
- ✅ TypeScript enabled
- ✅ Build script exists in `package.json`

### What Gets Deployed

- ✅ All your code
- ✅ Dependencies from `package.json`
- ✅ Static assets from `public/` folder
- ✅ Environment variables (set in Vercel dashboard)

### What Doesn't Get Deployed

- ❌ `.env.local` files (use Vercel Environment Variables instead)
- ❌ `node_modules` (installed during build)
- ❌ `.git` folder
- ❌ Files in `.gitignore`

---

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run build` locally first

### Images Not Loading

- Verify `next.config.ts` has correct `remotePatterns`
- Check image URLs are using HTTPS

### Environment Variables Not Working

- Ensure variables are set in Vercel dashboard
- Restart deployment after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

---

## Continuous Deployment

Once connected:

- ✅ Every push to `main` branch = automatic production deployment
- ✅ Pull requests = preview deployments (for testing)
- ✅ Automatic HTTPS
- ✅ Global CDN

---

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

---

## Need Help?

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 🐛 [Report Issues](https://github.com/vercel/vercel/issues)
