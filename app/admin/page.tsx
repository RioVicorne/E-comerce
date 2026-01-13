"use client";

import * as React from "react";
import { TrendingUp, Package, ShoppingCart, CreditCard, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/marketplace-data";

// Mock data for dashboard
const mockStats = {
  totalRevenue: 12500000,
  totalOrders: 342,
  totalProducts: products.length,
  pendingPayments: 12,
  completedOrders: 298,
  totalUsers: 1240,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Tổng quan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thống kê và phân tích tổng quan về hệ thống
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value={mockStats.totalRevenue}
          format="currency"
          icon={TrendingUp}
          trend="+12.5%"
          gradient="from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={mockStats.totalOrders}
          format="number"
          icon={ShoppingCart}
          trend="+8.2%"
          gradient="from-cyan-400/20 via-blue-500/10 to-violet-500/20"
        />
        <StatCard
          title="Sản phẩm"
          value={mockStats.totalProducts}
          format="number"
          icon={Package}
          trend="+3"
          gradient="from-blue-500/20 via-violet-500/10 to-fuchsia-500/20"
        />
        <StatCard
          title="Thanh toán chờ"
          value={mockStats.pendingPayments}
          format="number"
          icon={CreditCard}
          trend="Đang xử lý"
          gradient="from-fuchsia-500/20 via-red-500/10 to-violet-500/20"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-muted-foreground">
                  Đơn hàng hoàn thành
                </div>
                <div className="mt-2 text-3xl font-extrabold text-foreground">
                  {mockStats.completedOrders}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {Math.round((mockStats.completedOrders / mockStats.totalOrders) * 100)}% tổng đơn hàng
                </div>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20">
                <ShoppingCart className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-muted-foreground">
                  Tổng người dùng
                </div>
                <div className="mt-2 text-3xl font-extrabold text-foreground">
                  {mockStats.totalUsers.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Người dùng đã đăng ký
                </div>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20">
                <Users className="h-8 w-8 text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-extrabold text-foreground">
            Hoạt động gần đây
          </h2>
          <div className="mt-4 space-y-3">
            {[
              { action: "Đơn hàng mới", detail: "KW-20260113-561", time: "2 phút trước" },
              { action: "Thanh toán thành công", detail: "95.000₫", time: "5 phút trước" },
              { action: "Sản phẩm mới", detail: "Ví Steam 100.000₫", time: "10 phút trước" },
              { action: "Đơn hàng hoàn thành", detail: "KW-20260113-558", time: "15 phút trước" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-white/5 p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {activity.action}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.detail}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  format,
  icon: Icon,
  trend,
  gradient,
}: {
  title: string;
  value: number;
  format: "currency" | "number";
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  gradient: string;
}) {
  const formattedValue =
    format === "currency"
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }).format(value)
      : value.toLocaleString("vi-VN");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">
              {title}
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {formattedValue}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span>{trend}</span>
            </div>
          </div>
          <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient}`}>
            <Icon className="h-6 w-6 text-violet-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
