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
