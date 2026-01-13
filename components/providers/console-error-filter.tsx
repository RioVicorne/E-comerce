"use client";

import * as React from "react";

/**
 * Filters out false positive console errors from React DevTools
 * that occur when inspecting Next.js internal props (params, searchParams)
 */
export function ConsoleErrorFilter() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const originalError = console.error;
    const originalWarn = console.warn;

    // Filter out Next.js async API warnings from React DevTools
    const errorFilter = (message?: any, ...args: any[]) => {
      if (typeof message === "string") {
        // Filter out params/searchParams Promise warnings from React DevTools
        if (
          message.includes("params are being enumerated") ||
          message.includes("searchParams") ||
          message.includes("must be unwrapped with React.use()")
        ) {
          return; // Suppress this error
        }
      }
      originalError.call(console, message, ...args);
    };

    const warnFilter = (message?: any, ...args: any[]) => {
      if (typeof message === "string") {
        // Filter out params/searchParams Promise warnings
        if (
          message.includes("params are being enumerated") ||
          message.includes("searchParams") ||
          message.includes("must be unwrapped with React.use()")
        ) {
          return; // Suppress this warning
        }
      }
      originalWarn.call(console, message, ...args);
    };

    // Only filter in development (where React DevTools runs)
    if (process.env.NODE_ENV === "development") {
      console.error = errorFilter;
      console.warn = warnFilter;
    }

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
