"use client";

import * as React from "react";
import Image from "next/image";
import { Copy, Wallet, QrCode, AlertCircle, CheckCircle2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletStore } from "@/lib/wallet-store";

type TopUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

const QR_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function TopUpModal({ open, onOpenChange }: TopUpModalProps) {
  const [amount, setAmount] = React.useState<string>("");
  const [qrGenerated, setQrGenerated] = React.useState(false);
  const [qrGeneratedAt, setQrGeneratedAt] = React.useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = React.useState<
    "idle" | "pending" | "completed" | "expired"
  >("idle");
  const [currentTime, setCurrentTime] = React.useState(Date.now());
  const [qrImageError, setQrImageError] = React.useState(false);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const deposit = useWalletStore((state) => state.deposit);

  // Timer for QR expiration
  React.useEffect(() => {
    if (qrGenerated && qrGeneratedAt) {
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime(Date.now());
        const elapsed = Date.now() - qrGeneratedAt;
        if (elapsed > QR_TIMEOUT_MS && paymentStatus === "pending") {
          setPaymentStatus("expired");
        }
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [qrGenerated, qrGeneratedAt, paymentStatus]);

  // Reset when modal closes
  React.useEffect(() => {
    if (!open) {
      setAmount("");
      setQrGenerated(false);
      setQrGeneratedAt(null);
      setPaymentStatus("idle");
      setQrImageError(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  }, [open]);

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const handleGenerateQR = () => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || isNaN(numAmount)) {
      return;
    }
    setQrGenerated(true);
    setQrGeneratedAt(Date.now());
    setPaymentStatus("pending");
  };

  const handleSimulatePayment = () => {
    // Simulate payment confirmation
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      deposit(numAmount, `deposit-${Date.now()}`);
      setPaymentStatus("completed");
      // Auto close after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const isValidAmount = numAmount > 0;
  const bankName = "VPBank";
  const accountNumber = "1105200789";
  const accountName = "TRAN DINH KHOA";
  const description = `Nap tien vao vi ${Date.now()}`;

  const elapsed = qrGeneratedAt ? currentTime - qrGeneratedAt : 0;
  const remainingMs = Math.max(0, QR_TIMEOUT_MS - elapsed);
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const isExpired = paymentStatus === "expired" || remainingMs === 0;
  const isPaid = paymentStatus === "completed";

  const vietQrImageUrl = `https://img.vietqr.io/image/VPB-${accountNumber}-compact.png?amount=${numAmount}&addInfo=${encodeURIComponent(description)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-violet-300" />
            Nạp tiền vào tài khoản
          </DialogTitle>
          <DialogDescription>
            Nhập số tiền bạn muốn nạp và quét mã QR để thanh toán
          </DialogDescription>
        </DialogHeader>

        {!qrGenerated ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền nạp (VND)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Nhập số tiền..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1000"
                step="1000"
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Số tiền tối thiểu: 1.000đ
              </p>
            </div>

            <div className="space-y-2">
              <Label>Hoặc chọn nhanh</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      amount === preset.toString() &&
                        "ring-2 ring-violet-500 bg-violet-500/10"
                    )}
                  >
                    {formatVnd(preset)}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerateQR}
              disabled={!isValidAmount}
              className="w-full"
              size="lg"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Tạo mã QR thanh toán
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {paymentStatus === "completed" ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="rounded-full bg-green-500/20 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Nạp tiền thành công!</h3>
                  <p className="text-sm text-muted-foreground">
                    Đã nạp {formatVnd(numAmount)} vào ví của bạn
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <VietQrFrame
                    bankName={bankName}
                    accountNumber={accountNumber}
                    accountName={accountName}
                    amount={numAmount}
                    description={description}
                    isExpired={isExpired}
                    isPaid={isPaid}
                  >
                    {qrImageError ? (
                      <div className="flex h-[210px] w-[210px] items-center justify-center rounded-xl bg-neutral-100 text-xs text-neutral-500">
                        Không thể tải QR
                      </div>
                    ) : (
                      <Image
                        src={vietQrImageUrl}
                        alt="VietQR Code - Nạp tiền"
                        width={210}
                        height={210}
                        className="h-[210px] w-[210px]"
                        onError={() => setQrImageError(true)}
                        unoptimized
                      />
                    )}
                  </VietQrFrame>
                </div>

                <div className="space-y-3">
                  {!isPaid && !isExpired && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Còn lại: {remainingMinutes}:
                        {remainingSeconds.toString().padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {isExpired && (
                    <div className="flex items-center justify-center gap-2 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>QR đã hết hạn (10 phút)</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const qrData = `VPBank\nSố TK: ${accountNumber}\nChủ TK: ${accountName}\nSố tiền: ${formatVnd(
                          numAmount
                        )}\nNội dung: ${description}`;
                        await navigator.clipboard.writeText(qrData);
                      }}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Sao chép thông tin
                    </Button>

                    {isExpired && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setQrGeneratedAt(Date.now());
                          setPaymentStatus("pending");
                          setQrImageError(false);
                        }}
                        className="flex-1"
                      >
                        Tạo QR mới
                      </Button>
                    )}
                  </div>

                  {/* Simulate payment button - Remove in production */}
                  {process.env.NODE_ENV === "development" && (
                    <Button
                      variant="secondary"
                      onClick={handleSimulatePayment}
                      className="w-full"
                    >
                      [DEV] Simulate Payment Success
                    </Button>
                  )}
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <div className="font-semibold text-foreground">
                    Hướng dẫn nạp tiền
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Quét mã QR bằng ứng dụng ngân hàng của bạn</li>
                    <li>Xác nhận số tiền và nội dung chuyển khoản</li>
                    <li>Hoàn tất thanh toán trong vòng 10 phút</li>
                    <li>Sau khi thanh toán, số dư sẽ được cập nhật tự động</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
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
  isExpired,
  isPaid,
  children,
}: {
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
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
            Nạp tiền vào ví
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
      <div className="text-xs font-semibold text-neutral-500 shrink-0">
        {label}
      </div>
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
