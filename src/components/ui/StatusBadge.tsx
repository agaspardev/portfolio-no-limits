import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { StatusVariant } from "@/types/portfolio";

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  verified:
    "text-green-400 bg-green-500/10 border-green-500/30",
  issued:
    "text-cyan-300 bg-cyan-400/10 border-cyan-400/30",
  applied:
    "text-cyan-300 bg-cyan-400/10 border-cyan-400/30",
  operational:
    "text-green-400 bg-green-500/10 border-green-500/30",
  learning:
    "text-amber-400 bg-amber-500/10 border-amber-500/30",
  emerging:
    "text-violet-400 bg-violet-500/10 border-violet-500/30",
  core:
    "text-slate-100 bg-slate-100/8 border-slate-100/18",
};

const dotStyles: Record<StatusVariant, string> = {
  verified: "bg-green-400",
  issued: "bg-cyan-400",
  applied: "bg-cyan-400",
  operational: "bg-green-400",
  learning: "bg-amber-400",
  emerging: "bg-violet-400",
  core: "bg-slate-300",
};

export function StatusBadge({
  label,
  variant,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const { theme } = useTheme();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        variantStyles[variant],
        className,
      )}
      style={{
        color:
          theme === "dark"
            ? undefined
            : variant === "core"
              ? "rgb(15,23,42)"
              : undefined,
      }}
    >
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          dotStyles[variant],
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
