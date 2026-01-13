"use client";

import * as React from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/marketplace-data";

type CartItem = {
  product: Product;
  qty: number;
};

type CartSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
};

export function CartSidebar({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const formatVnd = (v: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(v);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.salePrice * item.qty,
    0
  );

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-hidden bg-background shadow-[0_0_0_1px_rgba(255,255,255,0.10)] lg:shadow-[0_30px_120px_-40px_rgba(168,85,247,0.8)]">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-white/10 bg-background/95 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/25 to-cyan-400/25">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-extrabold tracking-tight text-foreground">
                    Giỏ hàng
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {items.length} sản phẩm
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Đóng giỏ hàng"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/5">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  Giỏ hàng trống
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thêm sản phẩm vào giỏ hàng để tiếp tục
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                              {item.product.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.product.platform}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => onRemoveItem(item.product.id)}
                            aria-label="Xóa sản phẩm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm font-extrabold text-foreground">
                            {formatVnd(item.product.salePrice)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                if (item.qty > 1) {
                                  onUpdateQuantity(item.product.id, item.qty - 1);
                                } else {
                                  onRemoveItem(item.product.id);
                                }
                              }}
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[2rem] text-center text-sm font-semibold text-foreground">
                              {item.qty}
                            </span>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.qty + 1)
                              }
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-2 text-right text-xs text-muted-foreground">
                          Tổng: {formatVnd(item.product.salePrice * item.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/10 bg-background/95 backdrop-blur-xl p-6">
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{formatVnd(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>Tổng cộng</span>
                  <span className="text-lg font-extrabold">{formatVnd(total)}</span>
                </div>
              </div>
              <Button
                onClick={() => {
                  onCheckout();
                  onOpenChange(false);
                }}
                className="w-full"
                size="lg"
              >
                Thanh toán
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
