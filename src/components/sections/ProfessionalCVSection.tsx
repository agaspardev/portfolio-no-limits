"use client";

import { motion } from "framer-motion";
import { FileDown } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { CVData } from "@/types/portfolio";

interface ProfessionalCVSectionProps {
  cv: CVData;
}

export function ProfessionalCVSection({ cv }: ProfessionalCVSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.cv;
  const summaryAreaCopy = {
    es: {
      "Sistemas": { label: "Sistemas", description: "Base profesional en análisis, operación y administración tecnológica." },
      "Desarrollo Full-Stack": { label: "Desarrollo Full-Stack", description: "Experiencia en Angular, React, Node.js, .NET/C#, APIs, integración de sistemas y soluciones web." },
      "Cloud": { label: "Cloud", description: "Formación y experiencia aplicada en Azure, AWS y servicios cloud modernos." },
      "DevOps": { label: "DevOps", description: "Interés y práctica en automatización, CI/CD, GitHub Workflows, Scrum y mejora continua." },
      "Formación": { label: "Formación", description: "Cursos, bootcamps y estudios técnicos complementan la práctica profesional." },
      "Seguridad": { label: "Seguridad", description: "Experiencia e interés en análisis de vulnerabilidades, IAM, cloud security y buenas prácticas de ciberseguridad." },
      "Automatización": { label: "Automatización", description: "Enfoque en reducción de tareas repetitivas, eficiencia operativa y optimización de procesos." },
    },
    en: {
      "Sistemas": { label: "Systems", description: "Professional foundation in analysis, operations, and technology administration." },
      "Desarrollo Full-Stack": { label: "Full-Stack Development", description: "Experience in Angular, React, Node.js, .NET/C#, APIs, systems integration, and web solutions." },
      "Cloud": { label: "Cloud", description: "Training and experience applied to Azure, AWS, and modern cloud services." },
      "DevOps": { label: "DevOps", description: "Interest and practice in automation, CI/CD, GitHub Workflows, Scrum, and continuous improvement." },
      "Formación": { label: "Training", description: "Courses, bootcamps, and technical studies complement professional practice." },
      "Seguridad": { label: "Security", description: "Experience and interest in vulnerability analysis, IAM, cloud security, and cybersecurity best practices." },
      "Automatización": { label: "Automation", description: "Focus on reducing repetitive tasks, operational efficiency, and process optimization." },
    },
  }[locale] as Record<string, { label: string; description: string }>;
  return (
    <SectionContainer id="cv" className="border-t border-slate-800/40">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
          align="center"
        />

        {/* Download CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
              className="surface-card p-8 mb-10 text-center"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, rgba(0, 120, 212, 0.08), rgba(34, 211, 238, 0.05))"
                    : "linear-gradient(135deg, rgba(0, 120, 212, 0.03), rgba(34, 211, 238, 0.02))",
                borderColor: theme === "dark" ? "rgba(34, 211, 238, 0.20)" : "rgba(15, 23, 42, 0.10)",
              }}
        >
          {/* Snapshot pills */}
          <div
            className="flex flex-wrap justify-center gap-2 mb-8"
            role="list"
            aria-label={t.title}
          >
            {cv.snapshot.map((tag) => (
              <span
                key={tag}
                role="listitem"
                className="px-3 py-1 rounded-full font-mono text-xs border border-cyan-400/20 text-cyan-400/70 bg-cyan-400/5"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            {cv.files.map((file, index) => (
              <a
                key={file.href}
                href={file.href}
                target="_blank"
                rel="noreferrer"
                className={index === 0
                  ? "btn-primary inline-flex text-base px-8 py-4"
                  : "btn-secondary inline-flex text-base px-8 py-4"}
                aria-label={`${file.label} - ${locale === "es" ? "abrir en nueva pestaña" : "open in a new tab"}`}
              >
                <FileDown size={18} aria-hidden="true" />
                {file.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Summary areas grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cv.summaryAreas.map((area, i) => {
              const translated = summaryAreaCopy[area.label] ?? { label: area.label, description: area.description };
              return (
              <motion.div
                key={area.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="surface-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: theme === "dark" ? "rgba(34, 211, 238, 0.08)" : "rgba(0, 120, 212, 0.05)",
                    border: theme === "dark" ? "1px solid rgba(34, 211, 238, 0.15)" : "1px solid rgba(0, 120, 212, 0.12)",
                  }}
                  aria-hidden="true"
                >
                  <IconResolver name={area.icon} size={14} className="text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}>{translated.label}</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}>{translated.description}</p>
            </motion.div>
              );
            })}
        </div>
      </div>
    </SectionContainer>
  );
}
