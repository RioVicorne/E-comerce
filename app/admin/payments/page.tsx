"use client";

import * as React from "react";
import { Search, CheckCircle2, Clock, XCircle, QrCode } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock payments data
const mockPayments = [
  {
    id: "PAY-001",
    orderId: "KW-20260113-561",
    itemId: "p-1-0",
    amount: 95000,
    status: "pending",
    qrGeneratedAt: "2026-01-13 14:30",
    expiresAt: "2026-01-13 14:40",
    bank: "VPBank",
    accountNumber: "1105200789",
  },
  {
    id: "PAY-002",
    orderId: "KW-20260113-560",
    itemId: "p-2-0",
    amount: 189000,
    status: "paid",
    qrGeneratedAt: "2026-01-13 13:15",
    paidAt: "2026-01-13 13:18",
    bank: "VPBank",
    accountNumber: "1105200789",
  },
  {
    id: "PAY-003",
    orderId: "KW-20260113-559",
    itemId: "p-4-0",
    amount: 99000,
    status: "paid",
    qrGeneratedAt: "2026-01-13 12:00",
    paidAt: "2026-01-13 12:05",
    bank: "VPBank",
    accountNumber: "1105200789",
  },
  {
    id: "PAY-004",
    orderId: "KW-20260113-558",
    itemId: "p-6-0",
    amount: 499000,
    status: "expired",
    qrGeneratedAt: "2026-01-13 11:30",
    expiresAt: "2026-01-13 11:40",
    bank: "VPBank",
    accountNumber: "1105200789",
  },
];

export default function AdminPayments() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
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
      case "paid":
        return (
          <Badge variant="neon" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Đã thanh toán
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="default" className="gap-1">
            <Clock className="h-3 w-3" />
            Chờ thanh toán
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3" />
            Hết hạn
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Theo dõi Thanh toán
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý và theo dõi tất cả giao dịch thanh toán QR
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-muted-foreground">
              Tổng thanh toán
            </div>
            <div className="mt-2 text-2xl font-extrabold text-foreground">
              {formatVnd(
                mockPayments
                  .filter((p) => p.status === "paid")
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-muted-foreground">
              Đang chờ
            </div>
            <div className="mt-2 text-2xl font-extrabold text-foreground">
              {mockPayments.filter((p) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-muted-foreground">
              Đã thanh toán
            </div>
            <div className="mt-2 text-2xl font-extrabold text-foreground">
              {mockPayments.filter((p) => p.status === "paid").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thanh toán..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      {/* Payments List */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
          <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
          <TabsTrigger value="expired">Hết hạn</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="font-extrabold text-foreground">
                          {payment.id}
                        </div>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Đơn hàng: {payment.orderId} • Mục: {payment.itemId}
                      </div>
                      <div className="text-lg font-extrabold text-foreground">
                        {formatVnd(payment.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.bank} • {payment.accountNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        QR tạo: {payment.qrGeneratedAt}
                        {payment.paidAt && ` • Thanh toán: ${payment.paidAt}`}
                        {payment.expiresAt && ` • Hết hạn: ${payment.expiresAt}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <QrCode className="h-3 w-3" />
                        Xem QR
                      </Button>
                      {payment.status === "pending" && (
                        <Button size="sm">Kiểm tra</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <QrCode className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Không có giao dịch nào
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
