"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animations";

const FOCUS_ICONS: Record<string, string> = {
  cloud: "Cloud",
  development: "Code2",
  automation: "Zap",
  security: "ShieldCheck",
  ai: "Sparkles",
  integration: "Workflow",
};

export function CurrentFocusSection() {
  const { locale } = useLocale();
  const t = copy[locale].sections.focus;

  return (
    <SectionContainer id="focus">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
      >
        {Object.entries(t.items).map(([key, item]) => (
          <motion.article
            key={key}
            variants={fadeUp}
            className="surface-card surface-card-hover p-5 flex flex-col gap-3"
            role="listitem"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg icon-chip" aria-hidden="true">
              <IconResolver name={FOCUS_ICONS[key] ?? "Activity"} size={18} className="icon-accent" />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {item.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
