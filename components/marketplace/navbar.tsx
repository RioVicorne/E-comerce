"use client";

import * as React from "react";
import Link from "next/link";
import { LogIn, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/components/marketplace/icons";

type NavbarProps = {
  cartCount?: number;
  onCartClick?: () => void;
};

export function Navbar({ cartCount = 0, onCartClick }: NavbarProps) {
  const SearchIcon = iconMap.search;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/55 backdrop-blur-xl">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3">
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
              <div className="text-xs text-muted-foreground">
                Thị trường số
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "#news", label: "Tin tức Game" },
              { href: "#recruitment", label: "Tuyển dụng" },
              { href: "#instructions", label: "Hướng dẫn" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-xl">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm game key, bản quyền, thẻ quà tặng…"
                className="h-12 pl-11 pr-4"
              />
              <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(168,85,247,0.15),0_0_45px_-20px_rgba(34,211,238,0.28)]" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={onCartClick}
              aria-label="Mở giỏ hàng"
              className="relative"
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

            <Button variant="secondary" size="icon" aria-label="Đăng nhập / Đăng ký">
              <LogIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

