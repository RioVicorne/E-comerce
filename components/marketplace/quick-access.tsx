"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { iconMap } from "@/components/marketplace/icons";

export type QuickAccessItem = {
  id: string;
  label: string;
  icon: string;
};

export function QuickAccess({ items }: { items: QuickAccessItem[] }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-8">
      <div className="flex flex-wrap gap-3">
        {items.map((it) => {
          const Icon = iconMap[it.icon] ?? iconMap.sparkles;
          return (
            <motion.button
              key={it.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] transition hover:bg-white/10",
              )}
              type="button"
            >
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/25 via-fuchsia-500/10 to-cyan-400/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                <Icon className="h-5 w-5 text-violet-100" />
              </span>
              {it.label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

