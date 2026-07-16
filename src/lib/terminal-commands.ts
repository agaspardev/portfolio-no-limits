import profile from "@/data/profile.json";
import experience from "@/data/experience.json";
import skills from "@/data/skills.json";
import cv from "@/data/cv.json";
import projects from "@/data/projects.json";
import socialLinks from "@/data/social-links.json";
import { copy } from "@/data/copy";
import type { ChatLocale } from "./chat-context";

export interface TerminalMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TerminalCommandResult {
  output: string;
}

const certificationCount = cv.certifications.flatMap((group) => group.items).length;
const projectCount = projects.length;

const COMMANDS: Record<string, (args: string, locale: ChatLocale, messages?: TerminalMessage[]) => TerminalCommandResult> = {
  help: (_args, locale) => ({
    output: locale === "es"
      ? `Comandos disponibles:
  help              — Muestra esta ayuda
  whoami            — Información de Antonio
  ls                — Lista las secciones del portfolio
  cat <sección>     — Muestra contenido de una sección
  <sección>         — Atajo directo (ver abajo)
  pwd               — Ubicación actual
  date              — Fecha y hora
  neofetch          — Info del sistema
  history           — Historial de mensajes
  clear             — Limpia la terminal
  echo <texto>      — Repite un texto

Atajos (español): perfil, enfoque, capacidades, certificaciones, experiencia, proyectos, contacto, cv
Atajos (english): profile, focus, skills, credentials, experience, projects, contact, cv`
      : `Available commands:
  help              — Show this help
  whoami            — Antonio's information
  ls                — List portfolio sections
  cat <section>     — Show section content
  <section>         — Direct shortcut (see below)
  pwd               — Current location
  date              — Current date and time
  neofetch          — System info
  history           — Message history
  clear             — Clear the terminal
  echo <text>       — Echo back text

Shortcuts: profile, focus, skills, credentials, experience, projects, contact, cv`,
  }),

  whoami: (_args, locale) => {
    const role = locale === "es" ? profile.currentRoleEs : profile.currentRoleEn;
    return {
      output: locale === "es"
        ? `${profile.name}
${role} @ ${profile.currentCompany}
${profile.location}
Enfoque: ${profile.focusAreas.join(", ")}`
        : `${profile.name}
${role} @ ${profile.currentCompany}
${profile.location}
Focus: ${profile.focusAreas.join(", ")}`,
    };
  },

  ls: (_args, locale) => ({
    output: locale === "es"
      ? `Secciones del portfolio:
  profile/     — Perfil profesional
  focus/       — Enfoque actual
  skills/      — Capacidades técnicas
  credentials/ — Certificaciones (${certificationCount})
  experience/  — Experiencia laboral
  projects/    — Casos de trabajo (${projectCount})
  cv/          — CV profesional
  contact/     — Contacto y redes`
      : `Portfolio sections:
  profile/     — Professional profile
  focus/       — Current focus
  skills/      — Technical capabilities
  credentials/ — Certifications (${certificationCount})
  experience/  — Work experience
  projects/    — Work cases (${projectCount})
  cv/          — Professional CV
  contact/     — Contact and social links`,
  }),

  pwd: (_args, locale) => ({
    output: locale === "es"
      ? `/home/antonio@gaspar/portfolio`
      : `/home/antonio@gaspar/portfolio`,
  }),

  date: (_args, locale) => {
    const now = new Date();
    const formatted = now.toLocaleDateString(locale === "es" ? "es-CL" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = now.toLocaleTimeString(locale === "es" ? "es-CL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { output: `${formatted} ${time}` };
  },

  neofetch: (_args, locale) => {
    const role = locale === "es" ? profile.currentRoleEs : profile.currentRoleEn;
    return {
      output: locale === "es"
        ? `antonio@gaspar
──────────────
Rol:       ${role}
Empresa:   ${profile.currentCompany}
Ubicación: ${profile.location}
Stack:     ${skills.flatMap((g) => g.skillsEs).slice(0, 8).join(", ")}...
Certificados: ${cv.certifications.flatMap((g) => g.items).length}
Proyectos: ${projects.length}
Estado:    ${profile.status.label}`
        : `antonio@gaspar
──────────────
Role:      ${role}
Company:   ${profile.currentCompany}
Location:  ${profile.location}
Stack:     ${skills.flatMap((g) => g.skillsEn).slice(0, 8).join(", ")}...
Certificates: ${cv.certifications.flatMap((g) => g.items).length}
Projects:  ${projects.length}
Status:    ${profile.status.label}`,
    };
  },

  history: (_args, locale, messages) => {
    if (!messages || messages.length === 0) {
      return {
        output: locale === "es"
          ? "Historial vacío. Usa clear para limpiar."
          : "History empty. Use clear to clear.",
      };
    }
    const lines = messages.map((msg, i) => {
      const prefix = msg.role === "user" ? "$" : ">";
      const preview = msg.content.length > 60 ? msg.content.slice(0, 57) + "..." : msg.content;
      return `${String(i + 1).padStart(2)} ${prefix} ${preview}`;
    });
    return {
      output: locale === "es"
        ? `Historial (${messages.length} mensajes):\n${lines.join("\n")}`
        : `History (${messages.length} messages):\n${lines.join("\n")}`,
    };
  },

  echo: (args) => ({
    output: args || "",
  }),

  cat: (args, locale) => {
    const raw = args.trim().toLowerCase().replace(/\/$/, "");
    // Map Spanish names to English
    const ES_TO_EN: Record<string, string> = {
      perfil: "profile",
      enfoque: "focus",
      capacidades: "skills",
      certificaciones: "credentials",
      experiencia: "experience",
      proyectos: "projects",
      contacto: "contact",
    };
    const section = ES_TO_EN[raw] ?? raw;
    const sections: Record<string, () => string> = {
      profile: () => {
        const role = locale === "es" ? profile.currentRoleEs : profile.currentRoleEn;
        const about = copy[locale].sections.profile.about;
        return locale === "es"
          ? `# Perfil Profesional
${profile.name} — ${role} @ ${profile.currentCompany}
${profile.location}

${about.join("\n")}

Enfoque: ${profile.focusAreas.join(", ")}`
          : `# Professional Profile
${profile.name} — ${role} @ ${profile.currentCompany}
${profile.location}

${about.join("\n")}

Focus: ${profile.focusAreas.join(", ")}`;
      },
      skills: () => {
        return locale === "es"
          ? `# Capacidades Técnicas
${skills.map((g) => {
  const status = g.statusEs;
  return `## ${g.titleEs} [${status}]
${g.skillsEs.join(", ")}`;
}).join("\n\n")}`
          : `# Technical Capabilities
${skills.map((g) => {
  const status = g.statusEn;
  return `## ${g.titleEn} [${status}]
${g.skillsEn.join(", ")}`;
}).join("\n\n")}`;
      },
      credentials: () => {
        const certs = cv.certifications.flatMap((g) => g.items);
        return locale === "es"
          ? `# Certificaciones (${certs.length})
${certs.map((c, i) => `${i + 1}. ${c.title}`).join("\n")}`
          : `# Certifications (${certs.length})
${certs.map((c, i) => `${i + 1}. ${c.title}`).join("\n")}`;
      },
      experience: () => {
        return locale === "es"
          ? `# Experiencia Profesional
${experience.map((e) => {
  const role = e.roleEs;
  const summary = e.summaryEs;
  const stack = e.stackEs.join(", ");
  const current = e.isCurrent ? " (Actual)" : "";
  return `## ${role} — ${e.company}${current}
${summary}
Stack: ${stack}`;
}).join("\n\n")}`
          : `# Professional Experience
${experience.map((e) => {
  const role = e.roleEn;
  const summary = e.summaryEn;
  const stack = e.stackEn.join(", ");
  const current = e.isCurrent ? " (Current)" : "";
  return `## ${role} — ${e.company}${current}
${summary}
Stack: ${stack}`;
}).join("\n\n")}`;
      },
      projects: () => {
        return locale === "es"
          ? `# Casos de Trabajo (${projects.length})
${projects.map((p) => {
  const context = p.contextEs;
  const role = p.roleEs;
  const desc = p.descriptionEs;
  return `## ${p.title} — ${context}
${role}: ${desc}`;
}).join("\n\n")}`
          : `# Work Cases (${projects.length})
${projects.map((p) => {
  const context = p.contextEn;
  const role = p.roleEn;
  const desc = p.descriptionEn;
  return `## ${p.title} — ${context}
${role}: ${desc}`;
}).join("\n\n")}`;
      },
      contact: () => {
        const links = socialLinks.map((link) => {
          const label = locale === "es" ? link.labelEs : link.labelEn;
          const value = link.id === "email"
            ? link.url.replace(/^mailto:/, "")
            : link.url;
          return `${label} — ${value}`;
        }).join("\n");
        return locale === "es"
          ? `# Contacto y Redes
${links}
También puedes usar el formulario de contacto del portfolio.`
          : `# Contact and Social Links
${links}
You can also use the portfolio contact form.`;
      },
      cv: () => {
        const certs = cv.certifications.flatMap((g) => g.items);
        const edu = cv.education.flatMap((g) => g.items);
        return locale === "es"
          ? `# CV Profesional
Disponible en 3 versiones: Español, Inglés y Bilingüe.
Descárgalo desde la sección CV del portfolio.

## Resumen
Snapshot: ${cv.snapshot.join(", ")}

## Certificaciones (${certs.length})
${certs.map((c) => `- ${c.title}`).join("\n")}

## Formación (${edu.length})
${edu.map((e) => `- ${e.es}`).join("\n")}`
          : `# Professional CV
Available in 3 versions: Spanish, English, and Bilingual.
Download from the CV section of the portfolio.

## Summary
Snapshot: ${cv.snapshot.join(", ")}

## Certifications (${certs.length})
${certs.map((c) => `- ${c.title}`).join("\n")}

## Education (${edu.length})
${edu.map((e) => `- ${e.en}`).join("\n")}`;
      },
      focus: () => {
        return locale === "es"
          ? `# Enfoque Actual
${profile.focusAreas.join("\n")}`
          : `# Current Focus
${profile.focusAreas.join("\n")}`;
      },
    };

    if (!section) {
      return {
        output: locale === "es"
          ? "Uso: cat <sección>\nSecciones: profile, skills, credentials, experience, projects, contact, cv, focus"
          : "Usage: cat <section>\nSections: profile, skills, credentials, experience, projects, contact, cv, focus",
      };
    }

    const handler = sections[section];
    if (!handler) {
      return {
        output: locale === "es"
          ? `cat: ${section}: No existe esa sección.\nSecciones: profile, skills, credentials, experience, projects, contact, cv, focus`
          : `cat: ${section}: No such section.\nSections: profile, skills, credentials, experience, projects, contact, cv, focus`,
      };
    }

    return { output: handler() };
  },

  // Shortcut aliases — English
  profile: (args, locale) => COMMANDS.cat(`profile ${args}`, locale),
  skills: (args, locale) => COMMANDS.cat(`skills ${args}`, locale),
  credentials: (args, locale) => COMMANDS.cat(`credentials ${args}`, locale),
  experience: (args, locale) => COMMANDS.cat(`experience ${args}`, locale),
  projects: (args, locale) => COMMANDS.cat(`projects ${args}`, locale),
  contact: (args, locale) => COMMANDS.cat(`contact ${args}`, locale),
  cv: (args, locale) => COMMANDS.cat(`cv ${args}`, locale),
  focus: (args, locale) => COMMANDS.cat(`focus ${args}`, locale),
  // Shortcut aliases — Español
  perfil: (args, locale) => COMMANDS.cat(`profile ${args}`, locale),
  enfoque: (args, locale) => COMMANDS.cat(`focus ${args}`, locale),
  capacidades: (args, locale) => COMMANDS.cat(`skills ${args}`, locale),
  certificaciones: (args, locale) => COMMANDS.cat(`credentials ${args}`, locale),
  experiencia: (args, locale) => COMMANDS.cat(`experience ${args}`, locale),
  proyectos: (args, locale) => COMMANDS.cat(`projects ${args}`, locale),
  contacto: (args, locale) => COMMANDS.cat(`contact ${args}`, locale),
};

export function isTerminalCommand(input: string): boolean {
  const trimmed = input.replace(/^[\s$>]+/, "").trim().toLowerCase();
  const cmd = trimmed.split(/\s+/)[0];
  return cmd in COMMANDS;
}

export function executeTerminalCommand(
  input: string,
  locale: ChatLocale,
  messages?: TerminalMessage[],
): TerminalCommandResult | null {
  const cleaned = input.replace(/^[\s$>]+/, "").trim();
  const parts = cleaned.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  const handler = COMMANDS[cmd];
  if (!handler) return null;

  return handler(args, locale, messages);
}
