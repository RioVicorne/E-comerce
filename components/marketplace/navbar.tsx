"use client";

import * as React from "react";
import Link from "next/link";
import { LogIn, ShoppingCart, Menu, X, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { iconMap } from "@/components/marketplace/icons";

type NavbarProps = {
  cartCount?: number;
  onCartClick?: () => void;
};

export function Navbar({ cartCount = 0, onCartClick }: NavbarProps) {
  const SearchIcon = iconMap.search;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchExpanded, setSearchExpanded] = React.useState(false);

  const navItems = [
    { href: "#news", label: "Tin tức Game" },
    { href: "#recruitment", label: "Tuyển dụng" },
    { href: "#instructions", label: "Hướng dẫn" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/55 backdrop-blur-xl">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 md:gap-3 relative">
          {/* Hamburger Menu - Mobile Only */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="md:hidden min-h-[44px] min-w-[44px]"
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl px-2 py-1"
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/25 to-cyan-400/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <span className="text-sm font-black tracking-tight text-white">
                K
              </span>
              <span className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-cyan-400/20 opacity-0 blur-md transition group-hover:opacity-100" />
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-extrabold tracking-tight text-foreground">
                KeyMarket
              </div>
              <div className="text-xs text-muted-foreground">Thị trường số</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop Only */}
          <div className="hidden md:flex flex-1 items-center justify-center min-w-0 mx-2">
            <div className="relative w-full max-w-xl">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm game key, bản quyền, thẻ quà tặng…"
                className="h-12 pl-11 pr-4"
              />
              <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(168,85,247,0.15),0_0_45px_-20px_rgba(34,211,238,0.28)]" />
            </div>
          </div>

          {/* Mobile: Expanded Search (overlay below navbar) */}
          {searchExpanded && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/20 md:hidden"
                onClick={() => setSearchExpanded(false)}
              />
              {/* Search Bar */}
              <div className="fixed inset-x-0 top-[68px] z-50 md:hidden bg-background/98 backdrop-blur-xl border-b border-white/10 shadow-lg">
                <div className="relative w-full px-4 py-3">
                  <SearchIcon className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm game key, bản quyền, thẻ quà tặng…"
                    className="h-12 pl-11 pr-12 w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchExpanded(false);
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-7 top-1/2 h-10 w-10 -translate-y-1/2"
                    onClick={() => setSearchExpanded(false)}
                    aria-label="Đóng tìm kiếm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile: Search Button */}
            {!searchExpanded && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setSearchExpanded(true)}
                aria-label="Tìm kiếm"
                className="md:hidden min-h-[44px] min-w-[44px]"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="secondary"
              size="icon"
              onClick={onCartClick}
              aria-label="Mở giỏ hàng"
              className="relative min-h-[44px] min-w-[44px]"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 ? (
                <Badge
                  variant="neon"
                  className="absolute -right-2 -top-2 rounded-full px-2 py-0 text-[11px]"
                >
                  {cartCount}
                </Badge>
              ) : null}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              aria-label="Đăng nhập / Đăng ký"
              className="hidden min-h-[44px] min-w-[44px] sm:inline-flex"
            >
              <LogIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
