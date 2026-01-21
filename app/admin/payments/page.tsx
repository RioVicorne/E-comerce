"use client";

import * as React from "react";
import { Search, CheckCircle2, Clock, XCircle, QrCode, RefreshCw, Copy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Payment = {
  id: string;
  transactionId: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "expired" | "failed";
  bankName: string;
  accountNumber: string;
  accountName: string;
  userId: string | null;
  qrGeneratedAt: string;
  expiresAt: string;
  paidAt: string | null;
  confirmedBy: string | null;
  createdAt: string;
};

export default function AdminPayments() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  // Fetch payments from API
  const fetchPayments = React.useCallback(async () => {
    try {
      setLoading(true);
      const status = statusFilter === "all" ? "" : statusFilter;
      const response = await fetch(`/api/payments/list?status=${status}&limit=100`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Fetch on mount and when filter changes
  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Auto refresh every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchPayments();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchPayments]);

  // Handle confirm payment
  const handleConfirmPayment = async (payment: Payment) => {
    if (!confirm("Bạn có chắc chắn muốn xác nhận thanh toán này?")) {
      return;
    }

    try {
      setConfirmingId(payment.id);
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: payment.transactionId,
          description: payment.description,
          confirmedBy: "admin",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Lỗi khi xác nhận thanh toán");
        return;
      }

      // Refresh list
      await fetchPayments();
      alert("Đã xác nhận thanh toán thành công!");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Lỗi khi xác nhận thanh toán");
    } finally {
      setConfirmingId(null);
    }
  };

  // Copy description to clipboard
  const handleCopyDescription = async (description: string) => {
    try {
      await navigator.clipboard.writeText(description);
      alert("Đã sao chép nội dung chuyển khoản!");
    } catch (error) {
      console.error("Error copying:", error);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
      case "failed":
        return (
          <Badge variant="outline" className="gap-1 text-red-400">
            <XCircle className="h-3 w-3" />
            Thất bại
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
                payments
                  .filter((p) => p.status === "completed")
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
              {payments.filter((p) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-muted-foreground">
              Đã thanh toán
            </div>
            <div className="mt-2 text-2xl font-extrabold text-foreground">
              {payments.filter((p) => p.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo ID, transaction ID hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button
          variant="outline"
          onClick={fetchPayments}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Payments List */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
          <TabsTrigger value="completed">Đã thanh toán</TabsTrigger>
          <TabsTrigger value="expired">Hết hạn</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Đang tải...
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="font-extrabold text-foreground">
                              {payment.transactionId}
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {payment.id}
                            {payment.userId && ` • User: ${payment.userId}`}
                          </div>
                          <div className="text-lg font-extrabold text-foreground">
                            {formatVnd(payment.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payment.bankName} • {payment.accountNumber} • {payment.accountName}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono break-all">
                            Nội dung: {payment.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            QR tạo: {new Date(payment.qrGeneratedAt).toLocaleString("vi-VN")}
                            {payment.paidAt && ` • Thanh toán: ${new Date(payment.paidAt).toLocaleString("vi-VN")}`}
                            {payment.confirmedBy && ` • Xác nhận bởi: ${payment.confirmedBy}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Hết hạn: {new Date(payment.expiresAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyDescription(payment.description)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          {payment.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPayment(payment)}
                              disabled={confirmingId === payment.id}
                            >
                              {confirmingId === payment.id ? (
                                <>
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Đang xác nhận...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Xác nhận
                                </>
                              )}
                            </Button>
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
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
