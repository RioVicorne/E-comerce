"use client";

import * as React from "react";

import type { Product } from "@/lib/marketplace-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/marketplace/product-card";

type ProductTabsProps = {
  products: Product[];
  onBuyNow: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
};

export function ProductTabs({ products, onBuyNow, onAddToCart }: ProductTabsProps) {
  const bestSeller = products
    .filter((p) => p.tags.includes("best"))
    .sort((a, b) => b.sold - a.sold);
  const recommended = products.filter((p) => p.tags.includes("recommended"));
  const dealsUnder100k = products.filter(
    (p) => p.salePrice <= 100000 || p.tags.includes("deal"),
  );
  const highRating = products
    .filter((p) => p.tags.includes("high_rating"))
    .sort((a, b) => b.rating - a.rating);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-foreground">
            Sản phẩm nổi bật
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Giao hàng tức thì • thanh toán nhanh gọn • ưu đãi neon
          </div>
        </div>
      </div>

      <Tabs defaultValue="best">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="best">Bán chạy nhất</TabsTrigger>
          <TabsTrigger value="recommended">Đề xuất</TabsTrigger>
          <TabsTrigger value="deal">Ưu đãi &lt; 100k</TabsTrigger>
          <TabsTrigger value="rating">Đánh giá cao</TabsTrigger>
        </TabsList>

        <TabsContent value="best">
          <Grid products={bestSeller} onBuyNow={onBuyNow} onAddToCart={onAddToCart} />
        </TabsContent>
        <TabsContent value="recommended">
          <Grid products={recommended} onBuyNow={onBuyNow} onAddToCart={onAddToCart} />
        </TabsContent>
        <TabsContent value="deal">
          <Grid products={dealsUnder100k} onBuyNow={onBuyNow} onAddToCart={onAddToCart} />
        </TabsContent>
        <TabsContent value="rating">
          <Grid products={highRating} onBuyNow={onBuyNow} onAddToCart={onAddToCart} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Grid({
  products,
  onBuyNow,
  onAddToCart,
}: {
  products: Product[];
  onBuyNow: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onBuyNow={onBuyNow}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

