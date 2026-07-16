"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkillChip } from "@/components/ui/SkillChip";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { fadeUp, viewportOnce } from "@/lib/animations";
import type { ExperienceItem } from "@/types/portfolio";

interface OperationalTimelineSectionProps {
  experience: ExperienceItem[];
}

export function OperationalTimelineSection({ experience }: OperationalTimelineSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.experience;

  return (
    <SectionContainer id="experience">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <ol className="relative space-y-8" aria-label={t.aria}>
        {/* Vertical rail */}
        <div
          className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px hidden sm:block"
          style={{ background: "var(--border-subtle)" }}
          aria-hidden="true"
        />

        {experience.map((item) => {
          const role = locale === "es" ? item.roleEs : item.roleEn;
          const period = locale === "es" ? item.periodEs : item.periodEn;
          const periodLabel = locale === "es" ? item.periodLabelEs : item.periodLabelEn;
          const summary = locale === "es" ? item.summaryEs : item.summaryEn;
          const stack = locale === "es" ? item.stackEs : item.stackEn;
          const impact = locale === "es" ? item.impactEs : item.impactEn;

          return (
            <motion.li
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative sm:pl-10"
            >
              {/* Node dot */}
              <span
                className="absolute left-0 top-2 hidden sm:flex h-[15px] w-[15px] items-center justify-center rounded-full border"
                style={{
                  borderColor: item.isCurrent ? "var(--accent-cyan)" : "var(--border-subtle)",
                  background: item.isCurrent ? "rgba(6, 182, 212, 0.15)" : "var(--bg-void, transparent)",
                }}
                aria-hidden="true"
              >
                {item.isCurrent && (
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--accent-cyan)" }} />
                )}
              </span>

              <article className="surface-card p-6" aria-label={`${role} — ${item.company}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      {role}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {item.company} · {item.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-disabled)" }}>
                      {period}
                    </span>
                    {item.isCurrent ? (
                      <StatusBadge label={t.current} variant="operational" size="sm" />
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-disabled)" }}>
                        {periodLabel}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {summary}
                </p>

                <ul className="space-y-1.5 mb-4" aria-label={t.impact}>
                  {impact.map((point) => (
                    <li
                      key={point}
                      className="flex items-baseline gap-2 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span aria-hidden="true" style={{ color: "var(--accent-green)" }}>
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2" role="list" aria-label={t.stack}>
                  {stack.map((tech) => (
                    <SkillChip key={tech} label={tech} />
                  ))}
                </div>
              </article>
            </motion.li>
          );
        })}
      </ol>
    </SectionContainer>
  );
}
