"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, X, ShoppingCart } from "lucide-react";

import type { Product } from "@/lib/marketplace-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AddToCartConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onViewCart?: () => void;
  onCheckout?: () => void;
};

export function AddToCartConfirm({
  open,
  onOpenChange,
  product,
  onViewCart,
  onCheckout,
}: AddToCartConfirmProps) {
  if (!product) return null;

  const formatVnd = (v: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(v);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <DialogTitle className="text-lg font-extrabold">
              Đã thêm vào giỏ hàng
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-4 rounded-xl bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                  {product.title}
                </h3>
                <Badge variant="outline" className="text-xs shrink-0">
                  {product.platform}
                </Badge>
              </div>
              <div className="text-lg font-extrabold text-foreground">
                {formatVnd(product.salePrice)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onViewCart?.();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Xem giỏ hàng
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onCheckout?.();
              }}
            >
              Thanh toán ngay
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
