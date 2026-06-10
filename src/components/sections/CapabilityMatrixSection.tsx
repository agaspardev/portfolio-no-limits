"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillChip } from "@/components/ui/SkillChip";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import type { SkillGroup } from "@/types/portfolio";

interface CapabilityMatrixSectionProps {
  skills: SkillGroup[];
}

export function CapabilityMatrixSection({ skills }: CapabilityMatrixSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.skills;
  const localized = skills.map((group) => ({
    ...group,
    title: locale === "es" ? group.titleEs : group.titleEn,
    description: locale === "es" ? group.descriptionEs : group.descriptionEn,
    skills: locale === "es" ? group.skillsEs : group.skillsEn,
  }));
  return (
    <SectionContainer id="skills" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {localized.map((group, i) => (
          <motion.article
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="surface-card surface-card-hover p-6 flex flex-col gap-4"
            aria-labelledby={`skill-group-${group.id}`}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "rgba(34, 211, 238, 0.10)", border: "1px solid rgba(34, 211, 238, 0.20)" }}
                  aria-hidden="true"
                >
                  <IconResolver
                    name={group.icon}
                    size={16}
                    className="text-cyan-400"
                  />
                </div>
                <h3
                  id={`skill-group-${group.id}`}
                  className="text-sm font-semibold text-slate-100"
                >
                  {group.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed">
              {group.description}
            </p>

            {/* Capabilities */}
            <div
              className="flex flex-wrap gap-1.5 mt-auto"
              role="list"
              aria-label={`${locale === "es" ? "Capacidades" : "Capabilities"} de ${group.title}`}
            >
              {group.skills.map((skill) => (
                <SkillChip key={skill} label={skill} />
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionContainer>
  );
}
