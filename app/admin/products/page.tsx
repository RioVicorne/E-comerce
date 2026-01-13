"use client";

import * as React from "react";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import Image from "next/image";

import { products as initialProducts, type Product } from "@/lib/marketplace-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminProducts() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatVnd = (v: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(v);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Quản lý Sản phẩm
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý danh sách sản phẩm trong hệ thống
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                      {product.title}
                    </h3>
                    <Badge variant="outline">{product.platform}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-extrabold text-foreground">
                        {formatVnd(product.salePrice)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatVnd(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ⭐ {product.rating} • {product.sold.toLocaleString()} đã bán
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Edit className="h-3 w-3" />
                      Sửa
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Trash2 className="h-3 w-3" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Không tìm thấy sản phẩm nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
