import cv from "@/data/cv.json";
import socialLinks from "@/data/social-links.json";

import type { ChatLocale, ChatMessage } from "./chat-context";

const FILTER_ALIASES: Record<string, string[]> = {
  Cloud: ["cloud", "nube"],
  DevOps: ["devops"],
  Agile: ["agile", "agil", "scrum"],
  AI: ["ai", "ia", "inteligencia artificial", "artificial intelligence"],
  Security: ["security", "seguridad", "ciberseguridad", "cybersecurity"],
  Microsoft: ["microsoft"],
  Work: ["work", "trabajo remoto", "remote work"],
  Data: ["data", "datos"],
  PM: ["pm", "gestion de proyectos", "project management"],
};

const FILTER_LABELS: Record<string, Record<ChatLocale, string>> = {
  Cloud: { es: "Cloud", en: "Cloud" },
  DevOps: { es: "DevOps", en: "DevOps" },
  Agile: { es: "Agile", en: "Agile" },
  AI: { es: "IA", en: "AI" },
  Security: { es: "Seguridad", en: "Security" },
  Microsoft: { es: "Microsoft", en: "Microsoft" },
  Work: { es: "Trabajo remoto", en: "Remote Work" },
  Data: { es: "Data", en: "Data" },
  PM: { es: "Gestión de proyectos", en: "Project Management" },
};

const COUNT_TERMS = /\b(cuantas|cuantes|cuantos|numero de|cantidad de|how many|number of)\b/;
const CREDENTIAL_TERMS = /\b(credenciales?|credentials?|certificaciones?|certifications?|certificados?|certificates?)\b/;
const SEND_MESSAGE_REQUEST = /\b(?:(?:puedes\s+)?(?:enviar(?:le)?|envia(?:le)?|mandar(?:le)?|manda(?:le)?)\b.*\bmensaje|send\b.*\bmessage|message antonio)\b/;
const CONTACT_QUESTION = /\b(como (?:puedo )?(?:contacto|contactar)(?: a)? antonio|contactar a antonio|quiero contactar a antonio|contacto de antonio|correo de antonio|email de antonio|how (?:can|do) i contact antonio|contact antonio|antonio s contact|antonio s email|contact details)\b/;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const certificationItems = cv.certifications.flatMap((group) => group.items);
const canonicalEmail = socialLinks
  .find((link) => link.id === "email" && link.url.startsWith("mailto:"))
  ?.url.slice("mailto:".length);

export const contactKnowledge = {
  email: canonicalEmail ?? null,
  section: "Contacto",
};

export function getContactResponse(
  question: string,
  locale: ChatLocale,
): string | null {
  const normalized = normalize(question);
  const email = contactKnowledge.email;

  if (SEND_MESSAGE_REQUEST.test(normalized)) {
    if (locale === "es") {
      return email
        ? `Este chat todavía no envía mensajes. Puedes escribirle a ${email} o usar el formulario de la sección Contacto.`
        : "Este chat todavía no envía mensajes. Puedes usar el formulario de la sección Contacto.";
    }
    return email
      ? `This chat does not send messages yet. You can email Antonio at ${email} or use the Contact section form.`
      : "This chat does not send messages yet. You can use the Contact section form.";
  }

  if (!CONTACT_QUESTION.test(normalized)) return null;
  if (locale === "es") {
    return email
      ? `Puedes contactar a Antonio en ${email} o usar el formulario de la sección Contacto del portfolio.`
      : "Puedes contactar a Antonio mediante el formulario de la sección Contacto del portfolio.";
  }
  return email
    ? `You can contact Antonio at ${email} or use the form in the portfolio's Contact section.`
    : "You can contact Antonio through the form in the portfolio's Contact section.";
}

/** Live index derived from the same certification filters rendered by the portfolio UI. */
export const certificationKnowledge = {
  total: certificationItems.length,
  byFilter: Object.fromEntries(
    [...new Set(certificationItems.flatMap((item) => item.filters))]
      .map((filter) => [
        filter,
        certificationItems.filter((item) => item.filters.includes(filter)).length,
      ]),
  ) as Record<string, number>,
};

function findFilter(value: string): string | null {
  const normalized = normalize(value);
  return Object.entries(FILTER_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => new RegExp(`\\b${alias.replace(/ /g, "\\s+")}\\b`).test(normalized)),
  )?.[0] ?? null;
}

function isBareFilterReference(question: string): boolean {
  const filter = findFilter(question);
  if (!filter) return false;

  let remainder = normalize(question);
  for (const alias of FILTER_ALIASES[filter]) {
    remainder = remainder.replace(
      new RegExp(`\\b${alias.replace(/ /g, "\\s+")}\\b`, "g"),
      " ",
    );
  }
  const conversationalConnectors = new Set([
    "", "y", "and", "de", "del", "en", "sobre", "about", "what", "que",
  ]);
  return remainder
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .every((term) => conversationalConnectors.has(term));
}

function previousUserMessages(question: string, history: ChatMessage[]): string[] {
  const latestUserIndex = history.findLastIndex(
    (message) => message.role === "user" && message.content === question,
  );
  const priorHistory = latestUserIndex >= 0 ? history.slice(0, latestUserIndex) : history;
  return priorHistory
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .reverse();
}

export function isCredentialCountQuestion(
  question: string,
  history: ChatMessage[] = [],
): boolean {
  const normalized = normalize(question);
  const directCount = COUNT_TERMS.test(normalized)
    && (CREDENTIAL_TERMS.test(normalized) || findFilter(normalized) !== null);
  if (directCount) return true;

  if (!isBareFilterReference(question)) return false;
  return previousUserMessages(question, history)
    .some((previousQuestion) => COUNT_TERMS.test(normalize(previousQuestion))
      && (CREDENTIAL_TERMS.test(normalize(previousQuestion)) || findFilter(previousQuestion) !== null));
}

function resolveFilter(question: string, history: ChatMessage[]): string | null {
  const directFilter = findFilter(question);
  if (directFilter) return directFilter;

  const normalized = normalize(question);
  if (!COUNT_TERMS.test(normalized) || CREDENTIAL_TERMS.test(normalized)) return null;

  const previousUserMessage = [...history]
    .reverse()
    .find((message) => message.role === "user" && message.content !== question);
  return previousUserMessage ? findFilter(previousUserMessage.content) : null;
}

export function getCredentialCountResponse(
  question: string,
  locale: ChatLocale,
  history: ChatMessage[] = [],
): string | null {
  if (!isCredentialCountQuestion(question, history)) return null;

  const filter = resolveFilter(question, history);
  if (filter) {
    const count = certificationKnowledge.byFilter[filter];
    const label = FILTER_LABELS[filter]?.[locale] ?? filter;
    return locale === "es"
      ? `Antonio tiene ${count} ${count === 1 ? "credencial clasificada" : "credenciales clasificadas"} en ${label} dentro del portfolio.`
      : `Antonio has ${count} ${count === 1 ? "credential classified" : "credentials classified"} under ${label} in the portfolio.`;
  }

  return locale === "es"
    ? `Antonio tiene ${certificationKnowledge.total} credenciales profesionales publicadas en el portfolio.`
    : `Antonio has ${certificationKnowledge.total} professional credentials published in the portfolio.`;
}
