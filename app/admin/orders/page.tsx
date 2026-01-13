"use client";

import * as React from "react";
import { Search, Filter, CheckCircle2, Clock, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock orders data
const mockOrders = [
  {
    id: "KW-20260113-561",
    customer: "Nguyễn Văn A",
    items: [{ name: "Ví Steam 100.000₫", qty: 1, price: 95000 }],
    total: 95000,
    status: "pending",
    createdAt: "2026-01-13 14:30",
    paymentStatus: "chưa thanh toán",
  },
  {
    id: "KW-20260113-560",
    customer: "Trần Thị B",
    items: [
      { name: "Windows 11 Pro", qty: 1, price: 189000 },
      { name: "Netflix Premium", qty: 1, price: 79000 },
    ],
    total: 268000,
    status: "completed",
    createdAt: "2026-01-13 13:15",
    paymentStatus: "đã thanh toán",
  },
  {
    id: "KW-20260113-559",
    customer: "Lê Văn C",
    items: [{ name: "PUBG PC UC", qty: 2, price: 99000 }],
    total: 198000,
    status: "processing",
    createdAt: "2026-01-13 12:00",
    paymentStatus: "đã thanh toán",
  },
  {
    id: "KW-20260113-558",
    customer: "Phạm Thị D",
    items: [{ name: "PlayStation Gift Card", qty: 1, price: 499000 }],
    total: 499000,
    status: "completed",
    createdAt: "2026-01-13 11:30",
    paymentStatus: "đã thanh toán",
  },
];

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatVnd = (v: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(v);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="neon" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Hoàn thành
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="default" className="gap-1">
            <Clock className="h-3 w-3" />
            Đang xử lý
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Chờ thanh toán
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3" />
            Hủy
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Quản lý Đơn hàng
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Xem và quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button variant="secondary">
          <Filter className="h-4 w-4" />
          Lọc
        </Button>
      </div>

      {/* Orders List */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="font-extrabold text-foreground">
                          {order.id}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Khách hàng: {order.customer}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} sản phẩm • {formatVnd(order.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.createdAt} • {order.paymentStatus}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Xem chi tiết
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm">Xác nhận</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Không có đơn hàng nào
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
