"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { Profile } from "@/types/portfolio";

interface SystemProfileSectionProps {
  profile: Profile;
}

export function SystemProfileSection({ profile }: SystemProfileSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.profile;
  return (
    <SectionContainer id="profile" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* About text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {copy[locale].sections.profile.about.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(51,65,85)" }}>
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Operational Signature */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border p-6"
          style={{
            background: theme === "dark" ? "rgba(15, 23, 42, 0.60)" : "rgba(255,255,255,0.94)",
            borderColor: theme === "dark" ? "rgba(148, 163, 184, 0.16)" : "rgba(15, 23, 42, 0.12)",
          }}
        >
          <p className="mono-label mb-6 text-[10px]">{t.signature}</p>
          <ol className="space-y-4" aria-label={t.signatureAria}>
            {copy[locale].sections.profile.signatureItems.map((text, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-0.5 flex-shrink-0 font-mono text-[11px] font-semibold text-cyan-400"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-snug" style={{ color: theme === "dark" ? "rgb(203,213,225)" : "rgb(51,65,85)" }}>
                  {text}
                </span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
