"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ShoppingCart } from "lucide-react";
import Image from "next/image";

import type { Product } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Toast = {
  id: string;
  product: Product;
  timestamp: number;
};

type ToastContextType = {
  showToast: (product: Product) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((product: Product) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      product,
      timestamp: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const formatVnd = (v: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-auto"
    >
      <div className="relative w-[320px] rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10" />
        
        {/* Content */}
        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground">
                  Đã thêm vào giỏ hàng
                </div>
                <div className="text-xs text-muted-foreground">
                  Vừa xong
                </div>
              </div>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex gap-3 rounded-lg bg-white/5 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
              <Image
                src={toast.product.image}
                alt={toast.product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="line-clamp-2 text-xs font-semibold text-foreground">
                {toast.product.title}
              </div>
              <div className="text-sm font-extrabold text-foreground">
                {formatVnd(toast.product.salePrice)}
              </div>
            </div>
          </div>

          {/* View Cart Button */}
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full"
            onClick={() => {
              // Scroll to cart or open cart sidebar
              const event = new CustomEvent("openCart");
              window.dispatchEvent(event);
              onRemove(toast.id);
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Xem giỏ hàng
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
