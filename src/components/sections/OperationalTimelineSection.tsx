"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, MapPin, CheckCircle } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillChip } from "@/components/ui/SkillChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { ExperienceItem } from "@/types/portfolio";

interface OperationalTimelineSectionProps {
  experience: ExperienceItem[];
}

export function OperationalTimelineSection({
  experience,
}: OperationalTimelineSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.experience;
  const localized = experience.map((item) => ({
    id: item.id,
    company: item.company,
    role: locale === "es" ? item.roleEs : item.roleEn,
    period: locale === "es" ? item.periodEs : item.periodEn,
    periodLabel: locale === "es" ? item.periodLabelEs : item.periodLabelEn,
    location: item.location,
    type: locale === "es" ? item.typeEs : item.typeEn,
    isCurrent: item.isCurrent,
    summary: locale === "es" ? item.summaryEs : item.summaryEn,
    stack: locale === "es" ? item.stackEs : item.stackEn,
    impact: locale === "es" ? item.impactEs : item.impactEn,
  }));
  return (
    <SectionContainer id="experience" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-5 top-0 bottom-0 w-px hidden md:block"
          style={{ background: theme === "dark" ? "rgba(148, 163, 184, 0.12)" : "rgba(15, 23, 42, 0.08)" }}
          aria-hidden="true"
        />

        <ol className="space-y-6" aria-label={t.aria}>
          {localized.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="relative md:pl-16"
            >
              {/* Node dot */}
              <div
                className="absolute left-0 top-6 hidden md:flex h-10 w-10 items-center justify-center rounded-full border"
                style={{
                  background: item.isCurrent
                    ? theme === "dark"
                      ? "rgba(34, 211, 238, 0.12)"
                      : "rgba(0, 120, 212, 0.08)"
                    : theme === "dark"
                      ? "rgba(15, 23, 42, 0.80)"
                      : "rgba(255,255,255,0.92)",
                  borderColor: item.isCurrent
                    ? theme === "dark"
                      ? "rgba(34, 211, 238, 0.35)"
                      : "rgba(0, 120, 212, 0.18)"
                    : theme === "dark"
                      ? "rgba(148, 163, 184, 0.18)"
                      : "rgba(15, 23, 42, 0.12)",
                }}
                aria-hidden="true"
              >
                <BriefcaseBusiness
                  size={15}
                  className={item.isCurrent ? "text-cyan-400" : theme === "dark" ? "text-slate-500" : "text-slate-600"}
                />
              </div>

              {/* Card */}
              <div
                className="surface-card p-6 transition-all duration-300 hover:border-cyan-400/25"
                role="article"
                aria-label={`${item.role} ${locale === "es" ? "en" : "at"} ${item.company}`}
                style={{
                  background: theme === "dark" ? undefined : "rgba(255,255,255,0.94)",
                }}
              >
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-slate-100">
                        {item.role}
                      </h3>
                      {item.isCurrent && (
                        <StatusBadge label={t.current} variant="operational" />
                      )}
                    </div>
                    <p className="text-sm text-cyan-400 font-medium">
                      {item.company}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 font-mono">
                        {item.period}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin size={10} aria-hidden="true" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className="hidden sm:block font-mono text-[10px] px-2.5 py-1 rounded-md border border-slate-700/50 text-slate-500 self-start"
                    style={{
                      borderColor: theme === "dark" ? "rgba(148, 163, 184, 0.16)" : "rgba(15, 23, 42, 0.10)",
                      color: theme === "dark" ? undefined : "#64748b",
                      background: theme === "dark" ? undefined : "rgba(255,255,255,0.92)",
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Impact */}
                <ul className="space-y-1.5 mb-4" aria-label={t.impact}>
                  {item.impact.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                      <CheckCircle
                        size={12}
                        className="mt-0.5 flex-shrink-0 text-cyan-400/60"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Stack */}
                <div
                  className="flex flex-wrap gap-1.5"
                  role="list"
                  aria-label="Tecnologías utilizadas"
                >
                  {item.stack.map((tech) => (
                    <SkillChip key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </SectionContainer>
  );
}
