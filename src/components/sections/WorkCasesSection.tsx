"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconResolver } from "@/components/ui/IconResolver";
import { SkillChip } from "@/components/ui/SkillChip";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animations";
import type { Project, StatusVariant } from "@/types/portfolio";

interface WorkCasesSectionProps {
  projects: Project[];
}

export function WorkCasesSection({ projects }: WorkCasesSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.projects;
  const isEs = locale === "es";

  const ordered = [...projects].sort((a, b) => a.priority - b.priority);

  return (
    <SectionContainer id="projects">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <p className="text-xs font-mono mb-8 -mt-4" style={{ color: "var(--text-disabled)" }}>
        {t.note}
      </p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        role="list"
      >
        {ordered.map((project) => (
          <motion.article
            key={project.id}
            variants={fadeUp}
            className="surface-card surface-card-hover p-6 flex flex-col gap-4"
            role="listitem"
            aria-label={project.title}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg icon-chip" aria-hidden="true">
                  <IconResolver name={project.icon} size={18} className="icon-accent" />
                </div>
                <div>
                  <p className="mono-label text-[10px] mb-0.5">{project.group}</p>
                  <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {project.title}
                  </h3>
                </div>
              </div>
              <StatusBadge label={isEs ? project.statusEs : project.statusEn} variant={project.statusVariant as StatusVariant} size="sm" />
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {isEs ? project.descriptionEs : project.descriptionEn}
            </p>

            <ul className="space-y-1.5" aria-label={t.impactsAria}>
              {(isEs ? project.highlightsEs : project.highlightsEn).map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-baseline gap-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span aria-hidden="true" style={{ color: "var(--accent-cyan)" }}>
                    ▸
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-auto" role="list" aria-label={t.stackAria}>
              {project.stack.map((tech) => (
                <SkillChip key={tech} label={tech} />
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
