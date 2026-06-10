 "use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/ui/ScrambleText";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={ref}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      <p className="mono-label mb-3">{eyebrow}</p>
      <h2
        className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
        style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}
      >
        <ScrambleText text={title} active={active} />
      </h2>
      {description && (
        <p
          className={cn(
            "text-base leading-relaxed",
            align === "center" ? "mx-auto max-w-[640px]" : "max-w-[640px]",
          )}
          style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(71,85,105)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
