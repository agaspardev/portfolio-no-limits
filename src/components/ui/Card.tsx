import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li";
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  hover = false,
  as: Tag = "div",
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <Tag
      className={cn(
        "surface-card",
        hover && "surface-card-hover cursor-default",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
