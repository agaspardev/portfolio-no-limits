"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProfileNodeCard } from "@/components/ui/ProfileNodeCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animations";
import type { Profile } from "@/types/portfolio";

interface SystemProfileSectionProps {
  profile: Profile;
}

export function SystemProfileSection({ profile }: SystemProfileSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.profile;

  return (
    <SectionContainer id="profile">
      <div className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-[1fr_380px] lg:gap-x-14 lg:gap-y-4">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          className="mb-0 md:mb-0 lg:col-span-2"
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-[640px] text-base leading-relaxed lg:col-start-1 lg:row-start-2"
          style={{ color: "var(--text-muted)" }}
        >
          {t.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-start-2 lg:row-start-2 lg:row-span-2"
        >
          <ProfileNodeCard profile={profile} />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-start-1 lg:row-start-3"
        >
          {t.about.map((paragraph, i) => (
            <motion.p
              key={`about-${i}`}
              variants={fadeUp}
              className="text-base leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {paragraph}
            </motion.p>
          ))}

          <motion.div variants={fadeUp} className="mt-8">
            <p className="mono-label text-[10px] mb-4" style={{ color: "var(--accent-cyan)" }}>
              {t.signature}
            </p>
            <ol className="space-y-3" aria-label={t.signatureAria}>
              {profile.operationalSignature.map((item) => (
                <li key={item.order} className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--accent-cyan)" }}
                    aria-hidden="true"
                  >
                    {item.order}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {locale === "es" ? item.textEs : item.textEn}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>

      </div>
    </SectionContainer>
  );
}
