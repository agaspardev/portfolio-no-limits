"use client";

import { motion } from "framer-motion";
import { Cloud, Code2, Sparkles, ShieldCheck, GitBranch, Workflow } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";

const focusIcons = {
  cloud: Cloud,
  development: Code2,
  automation: Workflow,
  security: ShieldCheck,
  ai: Sparkles,
  integration: GitBranch,
} as const;

export function CurrentFocusSection() {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.focus;

  const items = [
    { key: "cloud", accent: "rgba(0, 120, 212, 0.12)" },
    { key: "development", accent: "rgba(34, 211, 238, 0.10)" },
    { key: "automation", accent: "rgba(34, 211, 238, 0.08)" },
    { key: "security", accent: "rgba(245, 158, 11, 0.10)" },
    { key: "ai", accent: "rgba(139, 92, 246, 0.10)" },
    { key: "integration", accent: "rgba(16, 185, 129, 0.10)" },
  ] as const;

  return (
    <SectionContainer id="focus" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const data = t.items[item.key];
          const Icon = focusIcons[item.key];
          return (
            <motion.article
              key={item.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="surface-card p-5"
              style={{
                background: theme === "dark" ? undefined : "rgba(255,255,255,0.96)",
                borderColor: theme === "dark" ? undefined : "rgba(15,23,42,0.10)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background: item.accent,
                    borderColor: theme === "dark" ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={16} className={theme === "dark" ? "text-cyan-300" : "text-cyan-600"} />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}
                  >
                    {data.title}
                  </h3>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(71,85,105)" }}
                  >
                    {data.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionContainer>
  );
}
