"use client";

import * as React from "react";
import {
  ShieldCheck,
  AlertCircle,
  Wallet,
  CheckCircle2,
  ArrowRight,
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
import { useWalletStore } from "@/lib/wallet-store";
import { TopUpModal } from "./topup-modal";

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
  onPaymentSuccess?: () => void;
};

export function PaymentModal({
  open,
  onOpenChange,
  order,
  onPaymentSuccess,
}: PaymentModalProps) {
  const balance = useWalletStore((state) => state.balance);
  const deduct = useWalletStore((state) => state.deduct);
  const [paymentStatus, setPaymentStatus] = React.useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [topUpOpen, setTopUpOpen] = React.useState(false);

  // Reset payment status when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setPaymentStatus("idle");
    }
  }, [open]);

  if (!order) return null;

  const hasSufficientBalance = balance >= order.total;
  const shortfall = order.total - balance;

  const handlePayNow = () => {
    if (!hasSufficientBalance) {
      return;
    }

    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(() => {
      const success = deduct(order.total, order.orderId, `Thanh toán đơn hàng ${order.orderId}`);
      
      if (success) {
        setPaymentStatus("success");
        // Auto close after 2 seconds and call success callback
        setTimeout(() => {
          onPaymentSuccess?.();
          onOpenChange(false);
        }, 2000);
      } else {
        setPaymentStatus("failed");
      }
    }, 1000);
  };

  const handleDepositClick = () => {
    onOpenChange(false);
    setTopUpOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-violet-300" />
              Thanh toán
            </DialogTitle>
            <DialogDescription>
              {hasSufficientBalance
                ? "Thanh toán từ số dư ví của bạn"
                : "Số dư không đủ để thanh toán đơn hàng này"}
            </DialogDescription>
          </DialogHeader>

          {paymentStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Thanh toán thành công!</h3>
                <p className="text-sm text-muted-foreground">
                  Đơn hàng {order.orderId} đã được thanh toán
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="rounded-2xl bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                <div className="text-sm font-semibold text-foreground mb-4">
                  Tóm tắt đơn hàng
                </div>
                <div className="text-xs text-muted-foreground mb-4">
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-muted-foreground">
                      Tổng đơn hàng
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-foreground">
                      {formatVnd(order.total)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="h-4 w-4" />
                      <span>Số dư ví</span>
                    </div>
                    <div
                      className={cn(
                        "text-lg font-bold",
                        hasSufficientBalance
                          ? "text-green-400"
                          : "text-red-400"
                      )}
                    >
                      {formatVnd(balance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status Messages */}
              {!hasSufficientBalance && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-semibold text-red-400">
                        Số dư không đủ
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bạn cần thêm {formatVnd(shortfall)} để thanh toán đơn hàng này.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasSufficientBalance && (
                <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-semibold text-green-400">
                        Số dư đủ để thanh toán
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Số dư còn lại sau thanh toán: {formatVnd(balance - order.total)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {hasSufficientBalance ? (
                  <Button
                    onClick={handlePayNow}
                    disabled={paymentStatus === "processing"}
                    className="flex-1"
                    size="lg"
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Thanh toán ngay
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDepositClick}
                    className="flex-1"
                    size="lg"
                    variant="default"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Nạp thêm tiền
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  size="lg"
                >
                  Hủy
                </Button>
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
          )}
        </DialogContent>
      </Dialog>

      <TopUpModal
        open={topUpOpen}
        onOpenChange={(open) => {
          setTopUpOpen(open);
          // Reopen payment modal if top-up is closed and we have sufficient balance now
          if (!open && useWalletStore.getState().balance >= order.total) {
            setTimeout(() => onOpenChange(true), 100);
          }
        }}
      />
    </>
  );
}

function formatVnd(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
}
