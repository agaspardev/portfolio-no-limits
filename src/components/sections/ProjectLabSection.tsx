"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkillChip } from "@/components/ui/SkillChip";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { Project, StatusVariant } from "@/types/portfolio";

interface ProjectLabSectionProps {
  projects: Project[];
}

const typeColors: Record<string, string> = {
  Lab: "text-cyan-400 bg-cyan-400/8 border-cyan-400/20",
  PoC: "text-violet-400 bg-violet-400/8 border-violet-400/20",
  Research: "text-amber-400 bg-amber-400/8 border-amber-400/20",
  Active: "text-green-400 bg-green-400/8 border-green-400/20",
  "Work Case": "text-sky-400 bg-sky-400/8 border-sky-400/20",
};

export function ProjectLabSection({ projects }: ProjectLabSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].sections.projects;
  const sortedProjects = [...projects].sort((a, b) => b.priority - a.priority);
  const featuredProjectId = sortedProjects[0]?.id;
  const groupedProjects = sortedProjects.reduce<Record<string, Project[]>>((acc, project) => {
    (acc[project.group] ??= []).push(project);
    return acc;
  }, {});

  return (
    <SectionContainer id="projects" className="border-t border-slate-800/40">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <div
        className="mb-6 rounded-2xl border px-4 py-3"
        style={{
          borderColor: theme === "dark" ? "rgba(56,189,248,0.16)" : "rgba(14,116,144,0.14)",
          background: theme === "dark" ? "rgba(2,6,23,0.35)" : "rgba(240,249,255,0.9)",
        }}
      >
          <p
          className="text-xs leading-relaxed"
          style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(51,65,85)" }}
        >
          {t.note}
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedProjects).map(([group, groupProjects], groupIndex) => (
          <section key={group} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3
                className="text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: theme === "dark" ? "rgb(103,232,249)" : "rgb(14,116,144)" }}
              >
                {group}
              </h3>
                <span
                  className="text-[11px]"
                  style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}
                >
                {groupProjects.length} {t.cases}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {groupProjects.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: groupIndex * 0.08 + i * 0.07 }}
                  className="surface-card surface-card-hover flex flex-col gap-4 p-6"
                  style={{
                    background:
                      theme === "dark"
                        ? project.id === featuredProjectId
                          ? "linear-gradient(180deg, rgba(6,182,212,0.12), rgba(15,23,42,0.92))"
                          : undefined
                        : project.id === featuredProjectId
                          ? "linear-gradient(180deg, rgba(236,254,255,0.98), rgba(255,255,255,0.98))"
                          : "rgba(255,255,255,0.96)",
                    borderColor:
                      theme === "dark"
                        ? project.id === featuredProjectId
                          ? "rgba(34,211,238,0.28)"
                          : undefined
                        : project.id === featuredProjectId
                          ? "rgba(14,116,144,0.22)"
                          : "rgba(15,23,42,0.10)",
                    boxShadow:
                      project.id === featuredProjectId
                        ? theme === "dark"
                          ? "0 0 0 1px rgba(34,211,238,0.08), 0 12px 30px rgba(2,6,23,0.25)"
                          : "0 0 0 1px rgba(14,116,144,0.08), 0 12px 24px rgba(15,23,42,0.05)"
                        : undefined,
                  }}
                  aria-labelledby={`project-${project.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: "rgba(34, 211, 238, 0.08)",
                          border: "1px solid rgba(34, 211, 238, 0.18)",
                        }}
                        aria-hidden="true"
                      >
                        <IconResolver name={project.icon} size={15} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            id={`project-${project.id}`}
                            className="text-sm font-semibold"
                            style={{ color: theme === "dark" ? "rgb(248,250,252)" : "rgb(15,23,42)" }}
                          >
                            {project.title}
                          </h3>
                          {project.id === featuredProjectId && (
                            <span
                              className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                color: theme === "dark" ? "rgb(103,232,249)" : "rgb(14,116,144)",
                                borderColor: theme === "dark" ? "rgba(103,232,249,0.28)" : "rgba(14,116,144,0.20)",
                                background: theme === "dark" ? "rgba(8,47,73,0.45)" : "rgba(240,249,255,0.95)",
                              }}
                            >
                              {t.featured}
                            </span>
                          )}
                        </div>
                        {project.id === featuredProjectId && (
                          <p
                            className="mt-1 text-[10px] uppercase tracking-[0.2em]"
                            style={{ color: theme === "dark" ? "rgb(103,232,249)" : "rgb(14,116,144)" }}
                          >
                            {t.featuredCase}
                          </p>
                        )}
                        <p
                          className="mt-0.5 text-[11px]"
                          style={{ color: theme === "dark" ? "rgb(125,211,252)" : "rgb(8,145,178)" }}
                        >
                          {project.context}
                        </p>
                        <p
                          className="text-[11px]"
                          style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(71,85,105)" }}
                        >
                          {project.role}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] ${typeColors[project.type] ?? "border-slate-700/50 text-slate-500"}`}
                        >
                          {project.type}
                        </span>
                      </div>
                    </div>
                    <StatusBadge
                      label={project.status}
                      variant={project.statusVariant as StatusVariant}
                    />
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: theme === "dark" ? "rgb(148,163,184)" : "rgb(51,65,85)" }}
                  >
                    {project.description}
                  </p>

                  <ul className="space-y-1.5" aria-label={t.featuresAria}>
                    {project.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: theme === "dark" ? "rgb(100,116,139)" : "rgb(71,85,105)" }}
                      >
                        <span
                          className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-cyan-400/50"
                          aria-hidden="true"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5" role="list" aria-label={t.contributionsAria}>
                    {project.contribution.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                        style={{
                          color: theme === "dark" ? "rgb(125,211,252)" : "rgb(2,132,199)",
                          borderColor:
                            theme === "dark"
                              ? "rgba(125,211,252,0.25)"
                              : "rgba(2,132,199,0.20)",
                          background:
                            theme === "dark"
                              ? "rgba(8,47,73,0.35)"
                              : "rgba(236,254,255,0.9)",
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5" role="list" aria-label={t.impactsAria}>
                    {project.impact.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                        style={{
                          color: theme === "dark" ? "rgb(167,139,250)" : "rgb(109,40,217)",
                          borderColor:
                            theme === "dark"
                              ? "rgba(167,139,250,0.24)"
                              : "rgba(109,40,217,0.18)",
                          background:
                            theme === "dark"
                              ? "rgba(49,46,129,0.24)"
                              : "rgba(245,243,255,0.92)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5" role="list" aria-label={t.stackAria}>
                    {project.stack.map((tech) => (
                      <SkillChip key={tech} label={tech} />
                    ))}
                  </div>

                  <div
                    className="mt-auto border-t pt-2"
                    style={{
                      borderColor: theme === "dark" ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)",
                    }}
                  />
                </motion.article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SectionContainer>
  );
}
