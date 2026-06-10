"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function BackgroundGrid() {
  const { theme } = useTheme();
  useEffect(() => {
    // CSS-based approach, no canvas needed
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${theme === "dark" ? "rgba(148, 163, 184, 0.04)" : "rgba(15, 23, 42, 0.025)"} 1px, transparent 1px),
            linear-gradient(90deg, ${theme === "dark" ? "rgba(148, 163, 184, 0.04)" : "rgba(15, 23, 42, 0.025)"} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Hero glow top-left */}
      <div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-30"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0, 120, 212, 0.04) 0%, transparent 70%)",
        }}
      />
      {/* Subtle glow bottom-right */}
      <div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(0, 120, 212, 0.18) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(34, 211, 238, 0.03) 0%, transparent 70%)",
        }}
      />
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: theme === "dark" ? 0.015 : 0.002,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
