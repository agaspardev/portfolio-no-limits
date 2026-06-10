"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  const [activeFilter, setActiveFilter] = useState<string>(t.filters.all);
  const themeCardClass = theme === "dark"
    ? "rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4"
    : "rounded-2xl border border-slate-200/80 bg-white/95 p-4";
  const courseAction = locale === "es" ? "Abrir" : "Open";
  const certAction = locale === "es" ? "Ver credencial" : "View credential";
  const ariaCourse = locale === "es" ? "Abrir curso: " : "Open course: ";
  const certDetailText: Record<string, string> = locale === "es"
    ? {}
    : {
        "Microsoft, emitida 04/06/2026, verificada.": "Microsoft, issued 06/04/2026, verified.",
        "CertiProf, vigente hasta 06/06/2029, verificada.": "CertiProf, valid until 06/06/2029, verified.",
        "Microsoft, emitida 05/06/2026, verificada.": "Microsoft, issued 06/05/2026, verified.",
        "Microsoft, emitida 06/06/2026, verificada.": "Microsoft, issued 06/06/2026, verified.",
        "CertiProf, vigente hasta 04/06/2029, verificada.": "CertiProf, valid until 06/04/2029, verified.",
        "CertiProf, vigente hasta 02/06/2029, verificada.": "CertiProf, valid until 06/02/2029, verified.",
        "CertiProf, emitida 02/06/2026, verificada.": "CertiProf, issued 06/02/2026, verified.",
      };
  const groupLabels: Record<string, string> = locale === "es"
    ? {
        "LinkedIn Learning": "LinkedIn Learning",
        "Escalab Academy": "Escalab Academy",
        "Cloud y Azure": "Cloud y Azure",
        Data: "Data",
        "Inteligencia artificial": "Inteligencia artificial",
        "Agile y Scrum": "Agile y Scrum",
        Seguridad: "Seguridad",
        "Gestión de proyectos": "Gestión de proyectos",
      }
    : {
        "LinkedIn Learning": "LinkedIn Learning",
        "Escalab Academy": "Escalab Academy",
        "Cloud y Azure": "Cloud and Azure",
        Data: "Data",
        "Inteligencia artificial": "Artificial Intelligence",
        "Agile y Scrum": "Agile and Scrum",
        Seguridad: "Security",
        "Gestión de proyectos": "Project Management",
      };
  const courseText: Record<string, string> = locale === "es"
    ? {
        "Fundamentos profesionales de gestión de proyectos": "Fundamentos profesionales de gestión de proyectos",
        "Introducción a AWS: Conceptos de la nube": "Introducción a AWS: Conceptos de la nube",
        "Introducción a AWS: Seguridad": "Introducción a AWS: Seguridad",
        "Introducción a AWS: Tarifas y servicios de soporte": "Introducción a AWS: Tarifas y servicios de soporte",
        "Bootcamp Full Stack Ninja": "Bootcamp Full Stack Ninja",
        "HTML5, CSS3, JavaScript, Git/GitHub, JavaScript Master, React JS y React Native.": "HTML5, CSS3, JavaScript, Git/GitHub, JavaScript Master, React JS y React Native.",
        "AWS.": "AWS.",
      }
    : {
        "Fundamentos profesionales de gestión de proyectos": "Professional project management fundamentals",
        "Introducción a AWS: Conceptos de la nube": "Introduction to AWS: Cloud concepts",
        "Introducción a AWS: Seguridad": "Introduction to AWS: Security",
        "Introducción a AWS: Tarifas y servicios de soporte": "Introduction to AWS: Pricing and support services",
        "Bootcamp Full Stack Ninja": "Full Stack Ninja Bootcamp",
        "HTML5, CSS3, JavaScript, Git/GitHub, JavaScript Master, React JS y React Native.": "HTML5, CSS3, JavaScript, Git/GitHub, JavaScript Master, React JS, and React Native.",
        "AWS.": "AWS.",
      };
  const educationText: Record<string, string> = locale === "es"
    ? {
        "Analista Programador Computacional | En curso | Chile": "Analista Programador Computacional | En curso | Chile",
        "Ingeniería de Sistemas | Formación en análisis de sistemas y programación | Venezuela": "Ingeniería de Sistemas | Formación en análisis de sistemas y programación | Venezuela",
        "Analista Programador | C, PHP/MySQL, Visual Basic .NET, C# .NET, SQL, HTML, Linux, redes e IT.": "Analista Programador | C, PHP/MySQL, Visual Basic .NET, C# .NET, SQL, HTML, Linux, redes e IT.",
        "Cisco IT Essentials | Cisco Networking Academy.": "Cisco IT Essentials | Cisco Networking Academy.",
      }
    : {
        "Analista Programador Computacional | En curso | Chile": "Computer Programming Analyst | In progress | Chile",
        "Ingeniería de Sistemas | Formación en análisis de sistemas y programación | Venezuela": "Systems Engineering | Training in systems analysis and programming | Venezuela",
        "Analista Programador | C, PHP/MySQL, Visual Basic .NET, C# .NET, SQL, HTML, Linux, redes e IT.": "Programming Analyst | C, PHP/MySQL, Visual Basic .NET, C# .NET, SQL, HTML, Linux, networking, and IT.",
      "Cisco IT Essentials | Cisco Networking Academy.": "Cisco IT Essentials | Cisco Networking Academy.",
      };
  const certAreaLabel: Record<string, string> = locale === "es"
    ? {
        "Cloud y Azure": "Cloud",
        Data: "Data",
        "Inteligencia artificial": "AI",
        "Agile y Scrum": "Agile",
        Seguridad: "Security",
        "Gestión de proyectos": "PM",
      }
    : {
        "Cloud y Azure": "Cloud",
        Data: "Data",
        "Inteligencia artificial": "AI",
        "Agile y Scrum": "Agile",
        Seguridad: "Security",
        "Gestión de proyectos": "PM",
      };

  useEffect(() => {
    setActiveFilter(t.filters.all);
  }, [t.filters.all]);

  const certifications = useMemo(
    () =>
      cv.certifications.flatMap((group) =>
        group.items.map((item) => ({
          title: item.title,
          href: item.href,
          detail: item.detail,
          tag: item.tag ?? (locale === "es" ? "Verificado" : "Verified"),
          filters: item.filters ?? [],
          group: group.group,
        })),
      ),
    [cv.certifications, locale],
  );

  const availableFilters = useMemo(() => {
    const filters = new Set<string>();
    for (const cert of certifications) {
      for (const filter of cert.filters ?? []) {
        filters.add(filter);
      }
    }
    return [t.filters.all, ...filters];
  }, [certifications]);

  const filtered =
    activeFilter === t.filters.all
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
              const label = t.filters[normalized] ?? filter;
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
                    <p className="text-xs" style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}>{certDetailText[cert.detail] ?? cert.detail}</p>
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
                  group.items.map((item) => ({ ...item, group: groupLabels[group.group] ?? group.group })),
                )
                .map((course) => (
                  <div
                    key={course.title}
                    className={themeCardClass}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-1">
                          {course.group}
                        </p>
                        <h4 className="text-sm font-semibold" style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}>
                          {courseText[course.title] ?? course.title}
                        </h4>
                        {course.detail && (
                          <p className="text-xs mt-1" style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}>
                            {courseText[course.detail] ?? course.detail}
                          </p>
                        )}
                      </div>
                      {course.href ? (
                        <a
                          href={course.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400/80 hover:text-cyan-300"
                          aria-label={`${ariaCourse}${course.title}`}
                        >
                          {courseAction}
                          <ExternalLink size={11} aria-hidden="true" />
                        </a>
                      ) : (
                          <StatusBadge label={locale === "es" ? "Referencia" : "Reference"} variant="operational" />
                      )}
                    </div>
                  </div>
                ))}
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
                      key={`${group.group}-${item}`}
                      className={themeCardClass}
                    >
                      <p className="text-sm" style={{ color: theme === "dark" ? "rgb(226,232,240)" : "rgb(15,23,42)" }}>{educationText[item] ?? item}</p>
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
