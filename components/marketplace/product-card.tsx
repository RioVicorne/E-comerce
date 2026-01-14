"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Gift,
  Monitor,
  Star,
  Tag,
  Ticket,
  Wallet,
  ShoppingCart,
} from "lucide-react";

import type { Product } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCard({
  product,
  onBuyNow,
  onAddToCart,
}: {
  product: Product;
  onBuyNow?: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
}) {
  const PlatformIcon = platformIcon(product.platform);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group"
    >
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(168,85,247,0.18),transparent_45%)] opacity-0 transition group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition group-hover:shadow-[inset_0_0_0_1px_rgba(168,85,247,0.35)]" />

        <CardContent className="p-3 md:p-4">
          <div className="relative overflow-hidden rounded-xl bg-white/5">
            <Image
              src={product.image}
              alt={product.title}
              width={640}
              height={360}
              className="h-40 w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute left-3 top-3 flex items-center gap-2">
              <Badge variant="neon" className="gap-1">
                <PlatformIcon className="h-3.5 w-3.5" />
                {product.platform}
              </Badge>
              {product.tags.includes("deal") ? (
                <Badge className="gap-1">
                  <Tag className="h-3.5 w-3.5 text-cyan-300" />
                  Ưu đãi
                </Badge>
              ) : null}
            </div>

            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/90">
              <Star className="h-3.5 w-3.5 text-amber-300" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-white/60">•</span>
              <span className="text-white/70">{formatSold(product.sold)} đã bán</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div
              className={cn(
                "overflow-hidden text-sm font-semibold leading-snug text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
              )}
              title={product.title}
            >
              {product.title}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-extrabold tracking-tight text-foreground">
                  {formatVnd(product.salePrice)}
                </div>
                {product.originalPrice ? (
                  <div className="text-xs font-semibold text-muted-foreground line-through">
                    {formatVnd(product.originalPrice)}
                  </div>
                ) : null}
              </div>
              {product.originalPrice ? (
                <Badge variant="outline" className="text-xs">
                  -{Math.round((1 - product.salePrice / product.originalPrice) * 100)}%
                </Badge>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onAddToCart?.(product)}
                aria-label="Thêm vào giỏ hàng"
                className="min-h-[44px] min-w-[44px]"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onBuyNow?.(product)}
                className="min-h-[44px] shadow-[0_20px_70px_-40px_rgba(34,211,238,0.8)]"
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function platformIcon(platform: Product["platform"]) {
  switch (platform) {
    case "Steam":
      return Gamepad2;
    case "Windows":
      return Monitor;
    case "PlayStation":
      return Ticket;
    case "Xbox":
      return Wallet;
    case "Mobile":
      return Gamepad2;
    case "GiftCard":
      return Gift;
    default:
      return Gamepad2;
  }
}

function formatVnd(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
}

function formatSold(v: number) {
  if (v >= 1000) return `${Math.round(v / 100) / 10}k`;
  return `${v}`;
}

