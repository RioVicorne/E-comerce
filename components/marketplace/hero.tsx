"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/lib/marketplace-data";

type HeroProps = {
  promotions: Promotion[];
};

export function Hero({ promotions }: HeroProps) {
  const [active, setActive] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Auto-play with pause support
  React.useEffect(() => {
    if (isPaused) return;

    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % promotions.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [promotions.length, isPaused]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return; // Don't interfere with text input
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, promotions.length]);

  const goToPrevious = () => {
    setIsPaused(true);
    setActive((v) => (v - 1 + promotions.length) % promotions.length);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToNext = () => {
    setIsPaused(true);
    setActive((v) => (v + 1) % promotions.length);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToSlide = (index: number) => {
    setIsPaused(true);
    setActive(index);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const promo = promotions[active];
  const isFirstSlide = active === 0;
  const isLastSlide = active === promotions.length - 1;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-8">
      <div className="grid gap-4 lg:grid-cols-[240px_1fr_240px]">
        {/* left floating banner */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <FloatingBanner
              title="Chỉ 20k/tháng"
              subtitle="Giá VIP • Hỗ trợ ưu tiên"
              tone="from-violet-500/25 via-fuchsia-500/15 to-cyan-400/10"
            />
            <FloatingBanner
              title="Giao hàng tức thì"
              subtitle="Key được giao trong vài giây"
              tone="from-cyan-400/20 via-blue-500/10 to-violet-500/20"
            />
          </div>
        </div>

        {/* center carousel */}
        <Card
          ref={cardRef}
          className="relative overflow-visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          tabIndex={0}
          role="region"
          aria-label="Carousel khuyến mãi"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-white/4" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

          {/* Left Navigation Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 z-[100] -translate-y-1/2"
            onClick={goToPrevious}
            disabled={isFirstSlide && promotions.length > 1}
            aria-label="Trước"
            aria-disabled={isFirstSlide && promotions.length > 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Right Navigation Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 z-[100] -translate-y-1/2"
            onClick={goToNext}
            disabled={isLastSlide && promotions.length > 1}
            aria-label="Tiếp"
            aria-disabled={isLastSlide && promotions.length > 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="relative flex min-h-[320px] items-stretch p-6 sm:p-10 overflow-hidden">
            <div className="flex w-full flex-col gap-6 overflow-hidden relative z-0">
              {/* Combined Content Container */}
              <div className="flex w-full items-stretch gap-6 overflow-hidden">
                <AnimatePresence mode="wait" custom={active}>
                  <motion.div
                    key={promo.id}
                    custom={active}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex w-full flex-1 items-stretch gap-6 relative z-0"
                  >
                    {/* Text Content */}
                    <div className="flex w-full flex-col justify-between gap-6">
                      <div className="space-y-4">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
                          )}
                        >
                          <Sparkles className="h-3 w-3 text-violet-300" />
                          Khuyến mãi nổi bật
                        </div>

                        <h1 className="text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                          {promo.title}
                        </h1>
                        <p className="max-w-xl text-pretty text-xs text-muted-foreground sm:text-sm">
                          {promo.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="default">{promo.cta}</Button>
                          <Button size="default" variant="outline">
                            Xem danh mục
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Gradient Box */}
                    <div className="hidden w-[200px] flex-col justify-center lg:flex">
                      <div
                        className={cn(
                          "relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br",
                          promo.gradient
                        )}
                      >
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
                        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_40%)]" />
                        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Dots - Bottom Center */}
              <div
                className="flex items-center justify-center gap-2"
                role="tablist"
                aria-label="Điều hướng slides"
              >
                {promotions.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => goToSlide(idx)}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2",
                      idx === active
                        ? "bg-gradient-to-r from-violet-400 to-cyan-300 shadow-[0_0_20px_rgba(168,85,247,0.55)] scale-110"
                        : "bg-white/15 hover:bg-white/25 hover:scale-105"
                    )}
                    role="tab"
                    aria-selected={idx === active}
                    aria-label={`Chuyển đến slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* right floating banner */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <FloatingBanner
              title="Ưu đãi & Quà tặng"
              subtitle="Thẻ quà tặng • mã ví"
              tone="from-blue-500/20 via-violet-500/15 to-fuchsia-500/20"
            />
            <FloatingBanner
              title="Thanh toán an toàn"
              subtitle="Luồng thanh toán đã xác minh"
              tone="from-fuchsia-500/15 via-violet-500/15 to-cyan-400/15"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingBanner({
  title,
  subtitle,
  tone,
}: {
  title: string;
  subtitle: string;
  tone: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <Card className="relative overflow-hidden p-5">
        <div className={cn("absolute inset-0 bg-gradient-to-br", tone)} />
        <div className="relative">
          <div className="text-sm font-extrabold tracking-tight text-foreground">
            {title}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </Card>
    </motion.div>
  );
}
