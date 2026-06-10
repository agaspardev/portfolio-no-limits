"use client";

import { motion } from "framer-motion";
import { FileDown, ChevronDown } from "lucide-react";
import { ProfileNodeCard } from "@/components/ui/ProfileNodeCard";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { Profile, CVData } from "@/types/portfolio";

interface CommandCenterSectionProps {
  profile: Profile;
  cv: CVData;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const introVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export function CommandCenterSection({ profile, cv }: CommandCenterSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].hero;
  return (
    <section
      id="command-center"
      className="relative min-h-[calc(100vh-72px)] flex items-center py-20 md:py-24"
      aria-label="Command Center — presentación profesional"
    >
      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            theme === "dark"
              ? `
                radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.10) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(0, 120, 212, 0.12) 0%, transparent 40%)
              `
              : `
                radial-gradient(circle at 20% 30%, rgba(0, 120, 212, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.03) 0%, transparent 40%)
              `,
        }}
      />

      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-center">
          {/* ── LEFT COLUMN ── */}
          <motion.div
            variants={introVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em]"
              style={{
                borderColor: theme === "dark" ? "rgba(34,211,238,0.22)" : "rgba(14,116,144,0.16)",
                color: theme === "dark" ? "rgb(103,232,249)" : "rgb(14,116,144)",
                background: theme === "dark" ? "rgba(2,6,23,0.45)" : "rgba(240,249,255,0.85)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
              {t.eyebrow}
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-4"
              style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}
            >
              {profile.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="gradient-text">
                {profile.name.split(" ").slice(-1).join(" ")}
              </span>
            </motion.h1>

            {/* Role */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl font-light mb-2 min-h-[2.5rem] md:min-h-[3rem] flex items-end"
              style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(51,65,85)" }}
            >
              <span className="inline-flex items-center">
                <TypewriterText
                  phrases={t.typedPhrases}
                  className="inline-flex items-center"
                  cursorClassName="ml-1 inline-block text-cyan-400"
                />
              </span>
            </motion.p>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-base" style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(51,65,85)" }}>{t.tagline}</p>
              <p className="text-sm mt-1 font-mono" style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}>{t.taglineSub}</p>
            </motion.div>

            {/* Summary */}
            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed max-w-2xl mb-8 border-l-2 border-cyan-400/30 pl-4"
              style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(51,65,85)" }}
            >
              {t.summary}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary justify-center sm:justify-start"
                aria-label={t.aria.ctaPrimary}
              >
                <FileDown size={16} aria-hidden="true" />
                {t.ctaPrimary}
              </a>
              <a
                href="#experience"
                className="btn-secondary justify-center sm:justify-start"
                aria-label={t.aria.ctaSecondary}
              >
                <ChevronDown size={16} aria-hidden="true" />
                {t.ctaSecondary}
              </a>
            </motion.div>

            {/* Hero chips */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2"
              role="list"
              aria-label={t.aria.chips}
            >
              {profile.heroChips.map((chip) => (
                  <motion.span
                  key={chip.label}
                  role="listitem"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium border transition-all"
                  style={{
                    background: theme === "dark" ? "rgba(15, 23, 42, 0.70)" : "rgba(255,255,255,0.92)",
                    borderColor: theme === "dark" ? "rgba(148, 163, 184, 0.18)" : "rgba(15, 23, 42, 0.10)",
                    color: theme === "dark" ? "#94a3b8" : "#334155",
                  }}
                >
                  <IconResolver
                    name={chip.icon}
                    size={13}
                    className="text-cyan-400"
                  />
                  {chip.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Profile Node ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <ProfileNodeCard profile={profile} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="hidden md:flex justify-center mt-16"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
            style={{ color: theme === "dark" ? "rgb(71,85,105)" : "rgb(100,116,139)" }}
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">
              {t.scroll}
            </span>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
