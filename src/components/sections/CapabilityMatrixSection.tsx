"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillChip } from "@/components/ui/SkillChip";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { SkillGroup } from "@/types/portfolio";

interface CapabilityMatrixSectionProps {
  skills: SkillGroup[];
}

export function CapabilityMatrixSection({ skills }: CapabilityMatrixSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.skills;
  const [activeTab, setActiveTab] = useState(0);

  const localized = skills.map((group) => ({
    ...group,
    title: locale === "es" ? group.titleEs : group.titleEn,
    description: locale === "es" ? group.descriptionEs : group.descriptionEn,
    skills: locale === "es" ? group.skillsEs : group.skillsEn,
  }));

  const currentGroup = localized[activeTab];

  return (
    <SectionContainer id="skills">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      {/* Tabs */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="tablist"
        aria-label={locale === "es" ? "Categorías de habilidades" : "Skill categories"}
      >
        {localized.map((group, i) => (
          <button
            key={group.id}
            role="tab"
            aria-selected={activeTab === i}
            aria-controls={`skill-panel-${group.id}`}
            onClick={() => setActiveTab(i)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              background: activeTab === i ? "rgba(0, 120, 212, 0.10)" : "transparent",
              borderColor: activeTab === i ? "var(--border-active)" : "var(--border-subtle)",
              color: activeTab === i ? "var(--accent-cyan)" : "var(--text-muted)",
            }}
          >
            <IconResolver
              name={group.icon}
              size={14}
              className={activeTab === i ? "icon-accent" : ""}
            />
            {group.title}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <AnimatePresence mode="wait">
        {currentGroup && (
          <motion.div
            key={currentGroup.id}
            id={`skill-panel-${currentGroup.id}`}
            role="tabpanel"
            aria-labelledby={`skill-tab-${currentGroup.id}`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            className="surface-card p-6 md:p-8"
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg icon-chip"
                aria-hidden="true"
              >
                <IconResolver
                  name={currentGroup.icon}
                  size={18}
                  className="icon-accent"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {currentGroup.title}
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {currentGroup.description}
                </p>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-2"
              role="list"
              aria-label={`${locale === "es" ? "Capacidades" : "Capabilities"} de ${currentGroup.title}`}
            >
              {currentGroup.skills.map((skill) => (
                <SkillChip key={skill} label={skill} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionContainer>
  );
}
