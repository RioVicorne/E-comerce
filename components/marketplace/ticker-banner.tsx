"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TickerBannerProps = {
  messages?: string[];
  speed?: "slow" | "normal" | "fast";
  className?: string;
};

const defaultMessages = [
  "Giao nhanh - Miễn phí",
  "Hỗ trợ 24/7",
  "Thanh toán an toàn",
  "Giao hàng tức thì",
  "Ưu đãi độc quyền",
];

export function TickerBanner({
  messages = defaultMessages,
  speed = "normal",
  className,
}: TickerBannerProps) {
  const speedClasses = {
    slow: "animate-scroll-left-infinite-slow",
    normal: "animate-scroll-left-infinite",
    fast: "animate-scroll-left-infinite-fast",
  };

  // Duplicate messages for seamless loop
  const duplicatedMessages = [...messages, ...messages];

  return (
    <div
      id="header"
      className={cn(
        "relative border-b border-white/10 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-cyan-400/10",
        "backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-screen-xl gap-6 overflow-hidden px-2 text-xs transition-all duration-200 ease-in-out xl:px-4 h-[36px] opacity-100 items-center">
        <div className="scrollbar-none flex overflow-hidden focus-visible:outline-none w-full">
          <div
            className={cn(
              "flex gap-6 items-center",
              speedClasses[speed]
            )}
          >
            {duplicatedMessages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-white whitespace-nowrap relative before:absolute before:top-1/2 before:-translate-y-1/2 before:-left-3 before:size-[5px] before:bg-violet-400 before:rounded-full"
              >
                <strong>{message}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
