"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import { cn } from "@/lib/utils";
import type { CVData } from "@/types/portfolio";

interface CredentialVaultSectionProps {
  cv: CVData;
}

function SectionBlock({
  title,
  eyebrow,
  icon,
  theme,
  children,
}: {
  title: string;
  eyebrow: string;
  icon: ReactNode;
  theme: "dark" | "light";
  children: ReactNode;
}) {
  return (
    <section
      className="surface-card p-5 md:p-6"
      style={{
        background: theme === "dark" ? undefined : "rgba(255, 255, 255, 0.94)",
        borderColor: theme === "dark" ? undefined : "rgba(15, 23, 42, 0.10)",
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg border text-cyan-400"
          style={{
            background: theme === "dark" ? "rgba(34, 211, 238, 0.08)" : "rgba(0, 120, 212, 0.06)",
            borderColor: theme === "dark" ? "rgba(34, 211, 238, 0.20)" : "rgba(0, 120, 212, 0.14)",
          }}
        >
          {icon}
        </div>
        <div>
          <p className="mono-label text-[10px] mb-1">{eyebrow}</p>
          <h3 className="text-base font-semibold" style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}>{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

export function CredentialVaultSection({ cv }: CredentialVaultSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.credentials;
  const [activeFilter, setActiveFilter] = useState<string>("__all__");
  const themeCardClass = theme === "dark"
    ? "rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4"
    : "rounded-2xl border border-slate-200/80 bg-white/95 p-4";
  const isEs = locale === "es";
  const courseAction = isEs ? "Abrir" : "Open";
  const certAction = isEs ? "Ver credencial" : "View credential";
  const ariaCourse = isEs ? "Abrir curso: " : "Open course: ";
  // Categorization codes (identical in both locales), not a translation.
  const certAreaLabel: Record<string, string> = {
    "Cloud y Azure": "Cloud",
    Data: "Data",
    "Inteligencia artificial": "AI",
    "Agile y Scrum": "Agile",
    Seguridad: "Security",
    "Gestión de proyectos": "PM",
    "Trabajo remoto": "Work",
  };

  const certifications = useMemo(
    () =>
      cv.certifications.flatMap((group) =>
        group.items.map((item) => ({
          title: item.title,
          href: item.href,
          detail: isEs ? item.detailEs : item.detailEn,
          tag: item.tag ?? (isEs ? "Verificado" : "Verified"),
          filters: item.filters ?? [],
          group: group.group,
        })),
      ),
    [cv.certifications, isEs],
  );

  const availableFilters = useMemo(() => {
    const filters = new Set<string>();
    for (const cert of certifications) {
      for (const filter of cert.filters ?? []) {
        filters.add(filter);
      }
    }
    return ["__all__", ...filters];
  }, [certifications]);

  const filtered =
    activeFilter === "__all__"
      ? certifications
      : certifications.filter((c) => c.filters?.includes(activeFilter));

  return (
    <SectionContainer id="credentials" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <div className="space-y-8">
        <SectionBlock
          title={t.blocks.certifications}
          eyebrow="VERIFIED CREDENTIALS"
          theme={theme}
          icon={<ShieldCheck size={16} aria-hidden="true" />}
        >
          <div
            className="flex flex-wrap gap-2 mb-5"
            role="group"
            aria-label="Filtrar certificaciones por categoría"
          >
            {availableFilters.map((filter) => {
              const normalized = filter.toLowerCase() as keyof typeof t.filters;
              const label = filter === "__all__" ? t.filters.all : (t.filters[normalized] ?? filter);
              return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border transition-all whitespace-nowrap",
                  activeFilter === filter
                    ? "text-cyan-300 border-cyan-400/50 bg-cyan-400/10"
                    : "text-slate-500 border-slate-700/50 hover:text-slate-300 hover:border-slate-600",
                )}
                aria-pressed={activeFilter === filter}
              >
                {label}
              </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((cert, i) => (
              <motion.article
                key={cert.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="surface-card surface-card-hover p-5 flex flex-col gap-4"
                aria-label={cert.title}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="inline-flex min-h-10 min-w-10 flex-shrink-0 items-center justify-center rounded-xl px-3 py-2 font-mono text-[11px] font-bold leading-none whitespace-nowrap"
                    style={{
                      background: theme === "dark" ? "rgba(0, 120, 212, 0.12)" : "rgba(0, 120, 212, 0.06)",
                      border: theme === "dark" ? "1px solid rgba(0, 120, 212, 0.25)" : "1px solid rgba(0, 120, 212, 0.12)",
                      color: "#0078D4",
                    }}
                    aria-label={cert.group}
                  >
                    {certAreaLabel[cert.group] ?? cert.group}
                  </div>
                  <StatusBadge label={locale === "es" ? "Verificado" : "Verified"} variant="verified" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold leading-snug mb-1" style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}>
                    {cert.title}
                  </h4>
                  {cert.detail && (
                    <p className="text-xs" style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}>{cert.detail}</p>
                  )}
                </div>
                {cert.href && (
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-400/80 hover:text-cyan-300 transition-colors"
                    aria-label={`${certAction}: ${cert.title}`}
                  >
                    {certAction}
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </SectionBlock>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionBlock
            title={t.blocks.courses}
            eyebrow="ADDITIONAL TRAINING"
            theme={theme}
            icon={<BookOpen size={18} aria-hidden="true" />}
          >
                <div className="space-y-3">
              {cv.courses
                .flatMap((group) =>
                  group.items.map((item) => ({ ...item, group: group.group })),
                )
                .map((course) => {
                  const courseTitle = isEs ? course.titleEs : course.titleEn;
                  const courseDetail = isEs ? course.detailEs : course.detailEn;
                  return (
                  <div
                    key={course.titleEn}
                    className={themeCardClass}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-1">
                          {course.group}
                        </p>
                        <h4 className="text-sm font-semibold" style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}>
                          {courseTitle}
                        </h4>
                        {courseDetail && (
                          <p className="text-xs mt-1" style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}>
                            {courseDetail}
                          </p>
                        )}
                      </div>
                      {course.href ? (
                        <a
                          href={course.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400/80 hover:text-cyan-300"
                          aria-label={`${ariaCourse}${courseTitle}`}
                        >
                          {courseAction}
                          <ExternalLink size={11} aria-hidden="true" />
                        </a>
                      ) : (
                          <StatusBadge label={isEs ? "Referencia" : "Reference"} variant="operational" />
                      )}
                    </div>
                  </div>
                  );
                })}
            </div>
          </SectionBlock>

          <SectionBlock
            title={t.blocks.education}
            eyebrow="ACADEMIC BACKGROUND"
            theme={theme}
            icon={<GraduationCap size={18} aria-hidden="true" />}
          >
            <div className="space-y-3">
              {cv.education.map((group) => (
                <div key={group.group} className="space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-1">
                    {group.group}
                  </p>
                  {group.items.map((item) => (
                    <div
                      key={`${group.group}-${item.en}`}
                      className={themeCardClass}
                    >
                      <p className="text-sm" style={{ color: theme === "dark" ? "rgb(226,232,240)" : "rgb(15,23,42)" }}>{isEs ? item.es : item.en}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SectionBlock>
        </div>
      </div>
    </SectionContainer>
  );
}
