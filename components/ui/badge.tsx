"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]",
        neon: "bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-cyan-400/20 text-foreground shadow-[inset_0_0_0_1px_rgba(168,85,247,0.35)]",
        outline: "border border-white/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
