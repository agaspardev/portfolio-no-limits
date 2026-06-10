"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { SocialLink } from "@/types/portfolio";

interface ContactGatewaySectionProps {
  socialLinks: SocialLink[];
}

export function ContactGatewaySection({ socialLinks }: ContactGatewaySectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.contact;
  const linkDescription: Record<string, string> = locale === "es"
    ? {
        linkedin: "Perfil profesional",
        instagram: "Contenido personal y profesional",
        credly: "Credenciales verificadas",
        badgeclaimed: "Insignias profesionales",
      }
    : {
        linkedin: "Professional profile",
        instagram: "Personal and professional content",
        credly: "Verified credentials",
        badgeclaimed: "Professional badges",
      };
  const primaryLinks = socialLinks.filter((l) => l.isPrimary);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <SectionContainer id="contact" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        align="center"
      />

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Contact form (visual only for now) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="surface-card p-6 space-y-5"
            aria-label={t.aria.form}
            style={{
              background: theme === "dark" ? "rgba(15, 23, 42, 0.74)" : "rgba(255, 255, 255, 0.94)",
              borderColor: theme === "dark" ? "rgba(148, 163, 184, 0.16)" : "rgba(15, 23, 42, 0.10)",
            }}
          >
            <p className="mono-label text-[10px] mb-4">{t.form}</p>

            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs text-slate-400 font-medium">
                {t.name}
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.namePlaceholder}
                className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                style={{
                  background: theme === "dark" ? "rgba(15, 23, 42, 0.80)" : "rgba(255,255,255,0.96)",
                  border: theme === "dark" ? "1px solid rgba(148, 163, 184, 0.16)" : "1px solid rgba(15, 23, 42, 0.12)",
                  color: theme === "dark" ? "rgb(226, 232, 240)" : "rgb(15, 23, 42)",
                }}
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs text-slate-400 font-medium">
                {t.email}
              </label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                style={{
                  background: theme === "dark" ? "rgba(15, 23, 42, 0.80)" : "rgba(255,255,255,0.96)",
                  border: theme === "dark" ? "1px solid rgba(148, 163, 184, 0.16)" : "1px solid rgba(15, 23, 42, 0.12)",
                  color: theme === "dark" ? "rgb(226, 232, 240)" : "rgb(15, 23, 42)",
                }}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-xs text-slate-400 font-medium">
                {t.message}
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t.messagePlaceholder}
                className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400/50 resize-none"
                style={{
                  background: theme === "dark" ? "rgba(15, 23, 42, 0.80)" : "rgba(255,255,255,0.96)",
                  border: theme === "dark" ? "1px solid rgba(148, 163, 184, 0.16)" : "1px solid rgba(15, 23, 42, 0.12)",
                  color: theme === "dark" ? "rgb(226, 232, 240)" : "rgb(15, 23, 42)",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              aria-label={t.aria.button}
            >
              <Send size={15} aria-hidden="true" />
              {t.button}
            </button>

            <p className="text-[10px] text-center" style={{ color: theme === "dark" ? "rgb(100, 116, 139)" : "rgb(100, 116, 139)" }}>
              {t.note}
            </p>
          </form>
        </motion.div>

        {/* Social / credential links */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <p className="mono-label text-[10px] mb-5">{t.channels}</p>

          {primaryLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-cyan-400/30 hover:bg-cyan-400/5"
              style={{
                borderColor: theme === "dark" ? "rgba(148, 163, 184, 0.16)" : "rgba(15, 23, 42, 0.10)",
                background: theme === "dark" ? "rgba(15, 23, 42, 0.40)" : "rgba(255, 255, 255, 0.92)",
              }}
              aria-label={`${locale === "es" ? link.labelEs : link.labelEn} — ${locale === "es" ? link.descriptionEs : link.descriptionEn}`}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors group-hover:border-cyan-400/30"
                style={{
                  background: theme === "dark" ? "rgba(15, 23, 42, 0.80)" : "rgba(255,255,255,0.96)",
                  border: theme === "dark" ? "1px solid rgba(148, 163, 184, 0.16)" : "1px solid rgba(15, 23, 42, 0.12)",
                }}
                aria-hidden="true"
              >
                <IconResolver name={link.icon} size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium transition-colors" style={{ color: theme === "dark" ? "rgb(226, 232, 240)" : "rgb(15, 23, 42)" }}>
                  {locale === "es" ? link.labelEs : link.labelEn}
                </p>
                <p className="text-xs" style={{ color: theme === "dark" ? "rgb(100, 116, 139)" : "rgb(71, 85, 105)" }}>
                  {linkDescription[link.id] ?? (locale === "es" ? link.descriptionEs : link.descriptionEn)}
                </p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </SectionContainer>
  );
}
