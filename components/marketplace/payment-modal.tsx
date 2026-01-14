"use client";

import * as React from "react";
import Image from "next/image";
import {
  Copy,
  QrCode,
  ShieldCheck,
  Clock,
  AlertCircle,
} from "lucide-react";

import type { Product } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CheckoutItem = {
  product: Product;
  qty: number;
};

export type CheckoutOrder = {
  orderId: string;
  items: CheckoutItem[];
  total: number;
};

type PaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: CheckoutOrder | null;
};

type PaymentState = "idle" | "pending" | "paid" | "expired";

type ItemPaymentStatus = {
  itemId: string;
  productId: string;
  qty: number;
  amount: number;
  qrGeneratedAt: number;
  status: PaymentState;
};

const QR_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const PAYMENT_CHECK_INTERVAL = 5000; // Check every 5 seconds

export function PaymentModal({ open, onOpenChange, order }: PaymentModalProps) {
  const [itemPayments, setItemPayments] = React.useState<ItemPaymentStatus[]>(
    []
  );
  const [qrImageErrors, setQrImageErrors] = React.useState<
    Record<string, boolean>
  >({});
  const [currentTime, setCurrentTime] = React.useState(Date.now());
  const checkIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check for expired QR codes only (no automatic payment detection)
  // In production, this would check with your payment API/webhook
  const checkPayments = React.useCallback(() => {
    const now = Date.now();
    setItemPayments((current) =>
      current.map((item) => {
        const elapsed = now - item.qrGeneratedAt;
        const isExpired = elapsed > QR_TIMEOUT_MS;

        // Only check for expiration, don't auto-detect payments
        if (isExpired && item.status !== "paid" && item.status !== "expired") {
          return { ...item, status: "expired" };
        }

        return item;
      })
    );
  }, []);

  // Initialize item payments when order opens
  React.useEffect(() => {
    if (!open || !order) {
      setItemPayments([]);
      setQrImageErrors({});
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    // Generate payment status for each item
    const initialPayments: ItemPaymentStatus[] = order.items.flatMap(
      ({ product, qty }) =>
        Array.from({ length: qty }, (_, idx) => ({
          itemId: `${product.id}-${idx}`,
          productId: product.id,
          qty: 1,
          amount: product.salePrice,
          qrGeneratedAt: Date.now(),
          status: "idle" as PaymentState,
        }))
    );
    setItemPayments(initialPayments);

    // Start automatic payment checking
    checkIntervalRef.current = setInterval(() => {
      checkPayments();
    }, PAYMENT_CHECK_INTERVAL);

    // Start timer for countdown display
    timerIntervalRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [open, order, checkPayments]);


  if (!order) return null;

  const bankName = "VPBank";
  const accountNumber = "1105200789";
  const accountName = "TRAN DINH KHOA";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-violet-300" />
            Thanh toán
          </DialogTitle>
          <DialogDescription>
            Thanh toán ưu tiên QR qua VietQR. Quét mã QR bằng ứng dụng ngân hàng
            để thanh toán.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4 min-w-0 overflow-hidden w-full">
            <Tabs defaultValue="qr">
              <TabsList className="w-full justify-start min-w-0 overflow-x-auto">
                <TabsTrigger value="qr" className="gap-2 shrink-0">
                  <QrCode className="h-4 w-4" />
                  Thanh toán qua QR
                </TabsTrigger>
                <TabsTrigger value="card" className="gap-2 shrink-0">
                  Thẻ (sắp có)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {itemPayments.map((itemPayment, idx) => {
                    const product = order.items.find(
                      (i) => i.product.id === itemPayment.productId
                    )?.product;
                    if (!product) return null;

                    const description = `Thanh toan ${order.orderId} Item:${itemPayment.itemId}`;
                    const vietQrImageUrl = `https://img.vietqr.io/image/VPB-${accountNumber}-compact.png?amount=${
                      itemPayment.amount
                    }&addInfo=${encodeURIComponent(description)}`;
                    const elapsed = currentTime - itemPayment.qrGeneratedAt;
                    const remainingMs = Math.max(0, QR_TIMEOUT_MS - elapsed);
                    const remainingMinutes = Math.floor(remainingMs / 60000);
                    const remainingSeconds = Math.floor(
                      (remainingMs % 60000) / 1000
                    );
                    const isExpired =
                      itemPayment.status === "expired" || remainingMs === 0;
                    const isPaid = itemPayment.status === "paid";

                    return (
                      <div
                        key={itemPayment.itemId}
                        className="grid gap-4 md:grid-cols-[280px_1fr] rounded-2xl bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] overflow-hidden w-full"
                      >
                        <div className="flex justify-center items-start w-full min-w-0">
                          <div className="w-full max-w-[280px]">
                            <VietQrFrame
                            bankName={bankName}
                            accountNumber={accountNumber}
                            accountName={accountName}
                            amount={itemPayment.amount}
                            description={description}
                            itemId={itemPayment.itemId}
                            isExpired={isExpired}
                            isPaid={isPaid}
                          >
                            {qrImageErrors[itemPayment.itemId] ? (
                              <div className="flex h-[210px] w-[210px] items-center justify-center rounded-xl bg-neutral-100 text-xs text-neutral-500">
                                Không thể tải QR
                              </div>
                            ) : (
                              <Image
                                src={vietQrImageUrl}
                                alt={`VietQR Code - ${product.title}`}
                                width={210}
                                height={210}
                                className="h-[210px] w-[210px]"
                                onError={() =>
                                  setQrImageErrors((prev) => ({
                                    ...prev,
                                    [itemPayment.itemId]: true,
                                  }))
                                }
                                unoptimized
                              />
                            )}
                          </VietQrFrame>
                          </div>
                        </div>

                        <div className="space-y-3 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-foreground">
                              {product.title}
                            </div>
                            <Badge
                              variant={
                                isPaid
                                  ? "neon"
                                  : isExpired
                                  ? "outline"
                                  : itemPayment.status === "pending"
                                  ? "default"
                                  : "default"
                              }
                            >
                              {isPaid
                                ? "Đã thanh toán"
                                : isExpired
                                ? "Hết hạn"
                                : itemPayment.status === "pending"
                                ? "Đang chờ"
                                : "Chưa thanh toán"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="font-semibold text-foreground">
                              {formatVnd(itemPayment.amount)}
                            </div>
                            {!isPaid && !isExpired && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Còn lại: {remainingMinutes}:
                                  {remainingSeconds.toString().padStart(2, "0")}
                                </span>
                              </div>
                            )}
                            {isExpired && (
                              <div className="flex items-center gap-1 text-red-400">
                                <AlertCircle className="h-3 w-3" />
                                <span>QR đã hết hạn (10 phút)</span>
                              </div>
                            )}
                          </div>

                          {isExpired && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setItemPayments((prev) =>
                                  prev.map((item) =>
                                    item.itemId === itemPayment.itemId
                                      ? {
                                          ...item,
                                          qrGeneratedAt: Date.now(),
                                          status: "idle",
                                        }
                                      : item
                                  )
                                );
                              }}
                            >
                              Tạo QR mới
                            </Button>
                          )}

                          {!isPaid && !isExpired && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={async () => {
                                const qrData = `VPBank\nSố TK: ${accountNumber}\nChủ TK: ${accountName}\nSố tiền: ${formatVnd(
                                  itemPayment.amount
                                )}\nNội dung: ${description}`;
                                await navigator.clipboard.writeText(qrData);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                              Sao chép thông tin
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="font-semibold text-foreground">
                    Mẹo để thanh toán QR suôn sẻ
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Xác nhận số tiền và nội dung trước khi xác nhận.</li>
                    <li>
                      Sử dụng đúng nội dung chuyển khoản để khớp thanh toán.
                    </li>
                    <li>
                      Mỗi QR có thời hạn 10 phút. Nhấp "Kiểm tra thanh toán
                      ngay" sau khi chuyển khoản.
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="card">
                <div className="rounded-2xl bg-white/5 p-4 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  Thanh toán bằng thẻ được cố ý ưu tiên thấp ở đây (theo yêu cầu
                  của bạn). Sẽ thêm sau khi cần.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 lg:sticky lg:top-0">
            <div className="rounded-2xl bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold text-foreground">
                Tóm tắt đơn hàng
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Mã đơn hàng:{" "}
                <span className="font-semibold text-foreground">
                  {order.orderId}
                </span>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                {order.items.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-10 shrink-0 rounded-xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {product.title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        SL: {qty} • {formatVnd(product.salePrice)}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {formatVnd(product.salePrice * qty)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-muted-foreground">
                  Tổng cộng
                </div>
                <div className="text-xl font-extrabold tracking-tight text-foreground">
                  {formatVnd(order.total)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-400/10 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="text-sm font-semibold text-foreground">
                Giao hàng tức thì
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Sau khi thanh toán được xác nhận, key/mã của bạn sẽ xuất hiện
                trong khu vực "Đơn hàng".
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VietQrFrame({
  bankName,
  accountNumber,
  accountName,
  amount,
  description,
  itemId,
  isExpired,
  isPaid,
  children,
}: {
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  itemId: string;
  isExpired?: boolean;
  isPaid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 text-black shadow-[0_30px_120px_-70px_rgba(34,211,238,0.75)] w-full max-w-[280px]",
        isExpired && "opacity-60",
        isPaid && "ring-2 ring-green-500"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-neutral-500">VietQR</div>
          <div className="text-base font-extrabold tracking-tight">
            Thanh toán qua QR
          </div>
        </div>
        <div className="rounded-xl bg-neutral-100 px-3 py-1 text-xs font-bold">
          {bankName}
        </div>
      </div>

      <div className="mt-4 grid place-items-center rounded-2xl bg-neutral-50 p-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
        {children}
      </div>

      <div className="mt-4 space-y-2 text-sm min-w-0">
        <Row label="Tài khoản" value={`${accountName} • ${accountNumber}`} />
        <Row label="Số tiền" value={formatVnd(amount)} strong />
        <Row
          label="Nội dung"
          value={description}
          valueClassName="font-mono text-[12px] break-words"
        />
        <Row
          label="Mã mục"
          value={itemId}
          valueClassName="font-mono text-[11px] text-neutral-600 break-words"
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  valueClassName,
}: {
  label: string;
  value: string;
  strong?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 min-w-0">
      <div className="text-xs font-semibold text-neutral-500 shrink-0">{label}</div>
      <div
        className={cn(
          "text-right text-sm min-w-0 break-words",
          strong && "font-extrabold",
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  );
}

function formatVnd(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
}
