"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { iconMap } from "@/components/marketplace/icons";

export type BentoCategory = {
  id: string;
  title: string;
  subtitle: string;
  tone: string;
  icon: string;
};

export function BentoGrid({ categories }: { categories: BentoCategory[] }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-4 md:pt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-foreground">
            Danh mục
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Banner nhanh để tìm thứ bạn cần.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] ?? iconMap.sparkles;
          return (
            <motion.div
              key={c.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Card className="relative overflow-hidden p-6 h-full">
                <div className={cn("absolute inset-0 bg-gradient-to-br", c.tone)} />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-lg font-extrabold tracking-tight text-foreground">
                      {c.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{c.subtitle}</div>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] shrink-0">
                    <Icon className="h-6 w-6 text-violet-200" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

