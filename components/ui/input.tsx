"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl bg-white/5 px-4 py-2 text-sm text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
