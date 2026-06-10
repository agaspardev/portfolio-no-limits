import { cn } from "@/lib/utils";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div" | "article";
}

export function SectionContainer({
  id,
  className,
  children,
  as: Tag = "section",
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative z-10 py-24 md:py-28",
        className,
      )}
    >
      <div className="section-container">{children}</div>
    </Tag>
  );
}
