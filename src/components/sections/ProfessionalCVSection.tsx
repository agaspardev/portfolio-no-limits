"use client";

import { motion } from "framer-motion";
import { FileDown } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animations";
import type { CVData } from "@/types/portfolio";

interface ProfessionalCVSectionProps {
  cv: CVData;
}

export function ProfessionalCVSection({ cv }: ProfessionalCVSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.cv;
  const isEs = locale === "es";

  return (
    <SectionContainer id="cv">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        role="list"
      >
        {cv.files.map((file) => (
          <motion.a
            key={file.href}
            variants={fadeUp}
            href={file.href}
            target="_blank"
            rel="noreferrer"
            className="surface-card surface-card-hover p-5 flex items-center gap-4"
            role="listitem"
            aria-label={`${isEs ? file.labelEs : file.labelEn} (${file.language}) — PDF`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg icon-chip" aria-hidden="true">
              <FileDown size={18} className="icon-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {isEs ? file.labelEs : file.labelEn}
              </p>
              <p className="font-mono text-[11px]" style={{ color: "var(--text-disabled)" }}>
                {file.language} · PDF
              </p>
            </div>
          </motion.a>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
      >
        {cv.summaryAreas.map((area) => (
          <motion.div
            key={area.labelEn}
            variants={fadeUp}
            className="surface-card p-5 flex gap-3"
            role="listitem"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg icon-chip" aria-hidden="true">
              <IconResolver name={area.icon} size={16} className="icon-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {isEs ? area.labelEs : area.labelEn}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {isEs ? area.descriptionEs : area.descriptionEn}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
