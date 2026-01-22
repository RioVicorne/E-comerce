"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingCart, Gamepad2, Gift, Monitor, Ticket, Wallet } from "lucide-react";

import type { Product } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProductListBoxProps = {
  products: Product[];
  onBuyNow: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
};

const categories = [
  { id: "best", label: "Bán chạy" },
  { id: "recommended", label: "Gợi ý cho bạn" },
  { id: "today", label: "Hôm nay có gì?" },
  { id: "under100k", label: "Dưới 100k" },
  { id: "deal", label: "Deal siêu hot" },
  { id: "rating", label: "Đánh giá cao" },
  { id: "all", label: "Xem tất cả" },
] as const;

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

export function ProductListBox({ products, onBuyNow, onAddToCart }: ProductListBoxProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("best");

  const filteredProducts = React.useMemo(() => {
    switch (activeCategory) {
      case "best":
        return products
          .filter((p) => p.tags.includes("best"))
          .sort((a, b) => b.sold - a.sold);
      case "recommended":
        return products.filter((p) => p.tags.includes("recommended"));
      case "today":
        // Show recent/best sellers for today
        return products
          .filter((p) => p.tags.includes("best") || p.tags.includes("recommended"))
          .slice(0, 10);
      case "under100k":
        return products.filter((p) => p.salePrice <= 100000);
      case "deal":
        return products.filter((p) => p.tags.includes("deal"));
      case "rating":
        return products
          .filter((p) => p.tags.includes("high_rating"))
          .sort((a, b) => b.rating - a.rating);
      case "all":
        return products;
      default:
        return products;
    }
  }, [products, activeCategory]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 pb-12 md:pt-10 md:pb-16">
      <div className="w-full overflow-hidden bg-transparent mt-[24px]">
        <div className="w-full">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-4 border-b border-white/10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all",
                  "hover:bg-white/5",
                  activeCategory === cat.id
                    ? "bg-white/10 text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
                    : "text-muted-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product List */}
          <div className="text-sm space-y-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onBuyNow={onBuyNow}
                  onAddToCart={onAddToCart}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Không có sản phẩm nào trong danh mục này
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductListItem({
  product,
  onBuyNow,
  onAddToCart,
}: {
  product: Product;
  onBuyNow: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
}) {
  const PlatformIcon = platformIcon(product.platform);

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-card/70 text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl hover:bg-card/90 transition-all border border-white/5">
      {/* Product Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute top-1 left-1">
          <Badge variant="neon" className="gap-1 text-[10px] px-1.5 py-0">
            <PlatformIcon className="h-2.5 w-2.5" />
            {product.platform}
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
          {product.title}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-base font-extrabold text-foreground">
            {formatVnd(product.salePrice)}
          </div>
          {product.originalPrice && (
            <>
              <span className="text-xs text-muted-foreground">~</span>
              <div className="text-xs font-semibold text-muted-foreground line-through">
                {formatVnd(product.originalPrice)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        size="sm"
        onClick={() => onBuyNow(product)}
        className="min-h-[36px] px-4 whitespace-nowrap"
      >
        <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
        Order
      </Button>
    </div>
  );
}
