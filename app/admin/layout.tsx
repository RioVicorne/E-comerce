"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout, getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/admin/payments", label: "Thanh toán", icon: CreditCard },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Check authentication on mount and route changes
  React.useEffect(() => {
    // Don't require auth for login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const checkAuth = () => {
      if (isAuthenticated()) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        router.push("/admin/login");
      }
    };

    checkAuth();
    
    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
    router.refresh();
  };

  // Show loading state
  if (loading && pathname !== "/admin/login") {
    return (
      <div className="app-bg flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-violet-400" />
      </div>
    );
  }

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Don't render if not authenticated
  if (!authenticated) {
    return null;
  }

  return (
    <div className="app-bg min-h-dvh">
      {/* Mobile sidebar toggle */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-background/55 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-lg font-extrabold text-foreground">
            Admin Panel
          </Link>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-background/95 backdrop-blur-xl transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 p-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-xl px-2 py-1"
              >
                <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/25 to-cyan-400/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  <span className="text-sm font-black tracking-tight text-white">
                    A
                  </span>
                </div>
                <div className="hidden leading-tight lg:block">
                  <div className="text-sm font-extrabold tracking-tight text-foreground">
                    Admin Panel
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quản lý hệ thống
                  </div>
                </div>
              </Link>
            </div>

            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      isActive
                        ? "bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20 text-foreground shadow-[inset_0_0_0_1px_rgba(168,85,247,0.30)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4 space-y-2">
              <div className="text-xs text-muted-foreground px-3 py-1">
                Đăng nhập: {getCurrentUser()?.username}
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
              <Link href="/">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
