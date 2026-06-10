"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface ScrambleTextProps {
  text: string;
  active?: boolean;
  className?: string;
  durationMs?: number;
  charset?: string;
}

export function ScrambleText({
  text,
  active = false,
  className,
  durationMs = 1700,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const reducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const chars = useMemo(() => charset.split(""), [charset]);

  useEffect(() => {
    if (!active || reducedMotion) {
      setDisplayText(text);
      return;
    }

    const animate = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const progress = Math.min((now - startRef.current) / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const revealCount = Math.floor(easedProgress * text.length);

      const next = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;
          const randomChar = chars[Math.floor(Math.random() * chars.length)] ?? char;
          return progress < 0.45 ? randomChar : char;
        })
        .join("");

      setDisplayText(next);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      startRef.current = null;
    };
  }, [active, chars, durationMs, reducedMotion, text]);

  return <span className={className}>{displayText}</span>;
}
