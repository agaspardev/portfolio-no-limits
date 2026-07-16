import cv from "@/data/cv.json";
import experience from "@/data/experience.json";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import skills from "@/data/skills.json";
import socialLinks from "@/data/social-links.json";
import {
  getContactResponse,
  getCredentialCountResponse,
  isCredentialCountQuestion,
} from "./chat-knowledge";

export type ChatLocale = "es" | "en";
export type ChatTopic =
  | "profile"
  | "experience"
  | "credentials"
  | "projects"
  | "contact";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type ExcludedScope = "coding" | "math" | "general";

const TOPIC_TERMS: Record<Exclude<ChatTopic, "profile">, string[]> = {
  experience: [
    "experiencia", "experience", "trabajo", "work", "cargo", "role", "rol",
    "stack", "habilidad", "skill", "tecnologia", "technology", "python",
    "angular", "react", "node", "net", "cloud", "aws", "azure", "devops",
    "seguridad", "security", "automatizacion", "automation", "full-stack",
  ],
  credentials: [
    "certificacion", "certification", "certificado", "certificate", "credencial",
    "credential", "formacion", "education", "estudio", "study", "curso", "course",
    "universidad", "university", "duoc", "credly",
  ],
  projects: ["proyecto", "project", "caso", "case", "portfolio", "plataforma", "platform"],
  contact: [
    "contacto", "contact", "correo", "email", "linkedin", "disponible",
    "available", "contratar", "hire", "redes", "social",
  ],
};

const ENGLISH_HINTS = /\b(hello|hi|hey|what|which|who|how|where|experience|skills?|projects?|contact|education|does|has|about)\b/i;
const SPANISH_HINTS = /\b(hola|buenas|que|quien|como|donde|experiencia|habilidades?|proyectos?|contacto|educacion|tiene|sobre)\b/i;

const PURE_GREETINGS = {
  es: new Set(["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches"]),
  en: new Set(["hello", "hi", "hey"]),
} satisfies Record<ChatLocale, Set<string>>;

const HELP_QUESTIONS = {
  es: new Set([
    "como me puedes ayudar",
    "en que me puedes ayudar",
    "que puedes hacer",
    "como puedes ayudarme",
  ]),
  en: new Set([
    "how can you help me",
    "what can you help me with",
    "what can you do",
  ]),
} satisfies Record<ChatLocale, Set<string>>;

const DETERMINISTIC_REPLIES = {
  es: {
    greeting: "¡Hola! Encantado de ayudarte. Puedes preguntarme por la experiencia, tecnologías, certificaciones o proyectos de Antonio.",
    help: "¡Claro! Puedo ayudarte con la experiencia, tecnologías, certificaciones, proyectos o formas de contacto de Antonio.",
    python: "Python forma parte del stack de su rol actual como Integrador de Sistemas, donde participa en integración, automatización y mejora continua de aplicaciones web.",
    rust: "Rust no forma parte del stack profesional publicado de Antonio.",
    coding: "Puedo contarte sobre la experiencia profesional de Antonio con Python, pero este asistente no genera código ni resuelve tareas de programación.",
    general: "Este asistente está enfocado en el perfil profesional de Antonio. Puedo ayudarte con su experiencia, tecnologías, certificaciones o proyectos.",
  },
  en: {
    greeting: "Hi! Happy to help. You can ask me about Antonio's experience, technologies, certifications, or projects.",
    help: "Of course! I can help with Antonio's experience, technologies, certifications, projects, or contact details.",
    python: "Python is part of his current stack as a Systems Integrator, where he contributes to integration, automation, and continuous improvement of web applications.",
    rust: "Rust is not part of Antonio's published professional stack.",
    coding: "I can tell you about Antonio's professional experience with Python, but this assistant does not generate code or solve programming tasks.",
    general: "This assistant focuses on Antonio's professional profile. I can help with his experience, technologies, certifications, or projects.",
  },
} satisfies Record<ChatLocale, Record<"greeting" | "help" | "python" | "rust" | "coding" | "general", string>>;

function searchable(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function conversationalText(value: string): string {
  return searchable(value)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CODE_ACTION = /\b(crea|crear|creando|escribe|escribir|genera|generar|generando|implementa|implementar|corrige|corregir|explica|explicar|programa|programar|create|creating|write|writing|generate|generating|implement|fix|debug|explain|code|coding)\b/;
const CODE_ARTIFACT = /\b(codigo|code|funcion|function|script|programa|program|componente|component|api|endpoint|consulta sql|sql query|clase|class|algoritmo|algorithm)\b/;
const MATH_REQUEST = /(?:^|\b)(cuanto es|calcula|calcular|resuelve|resolver|calculate|solve)(?:\b|$)|(?:^|\s)\d+(?:\s*[+*/=^-]\s*\d+)+(?:\s|$)/;
const GENERAL_KNOWLEDGE = /\b(independencia|independence|capital de|capital of|clima|weather|pronostico|forecast|receta|recipe|traduce|traducir|translate|quien fue|who was|cuando fue|when was|fecha historica|historical date)\b/;
const CONTEXTUAL_FOLLOW_UP = new Set([
  "hazlo", "ayudame", "asisteme", "muestrame", "adelante",
  "do it", "help me", "assist me", "show me", "go ahead",
]);

function classifyExcludedScope(question: string): ExcludedScope | null {
  const normalized = conversationalText(question);
  const normalizedWithOperators = searchable(question).replace(/\s+/g, " ").trim();

  // An actionable programming request wins over technology/profile FAQs.
  if (CODE_ACTION.test(normalized) && CODE_ARTIFACT.test(normalized)) return "coding";
  if (MATH_REQUEST.test(normalizedWithOperators)) return "math";
  if (GENERAL_KNOWLEDGE.test(normalized)) return "general";
  return null;
}

function contextualExcludedScope(
  question: string,
  history: ChatMessage[],
): ExcludedScope | null {
  const directScope = classifyExcludedScope(question);
  if (directScope) return directScope;

  const normalized = conversationalText(question);
  if (!CONTEXTUAL_FOLLOW_UP.has(normalized)) return null;

  const latestUserIndex = history.findLastIndex(
    (message) => message.role === "user" && message.content === question,
  );
  const priorHistory = latestUserIndex >= 0
    ? history.slice(0, latestUserIndex)
    : history;
  const previousUserMessage = [...priorHistory]
    .reverse()
    .find((message) => message.role === "user");
  return previousUserMessage
    ? classifyExcludedScope(previousUserMessage.content)
    : null;
}

/** Returns stable, zero-token responses for greetings, help, and verified common FAQs. */
export function getDeterministicChatResponse(
  question: string,
  preferredLocale?: ChatLocale,
  history: ChatMessage[] = [],
): string | null {
  const normalized = conversationalText(question);

  const excludedScope = contextualExcludedScope(question, history);
  if (excludedScope) {
    const locale = detectChatLocale(question, preferredLocale);
    return excludedScope === "coding"
      ? DETERMINISTIC_REPLIES[locale].coding
      : DETERMINISTIC_REPLIES[locale].general;
  }

  const locale = detectChatLocale(question, preferredLocale);
  const contactResponse = getContactResponse(question, locale);
  if (contactResponse) return contactResponse;

  const credentialCountResponse = getCredentialCountResponse(question, locale, history);
  if (credentialCountResponse) return credentialCountResponse;

  for (const locale of ["es", "en"] as const) {
    if (PURE_GREETINGS[locale].has(normalized)) {
      return DETERMINISTIC_REPLIES[locale].greeting;
    }

    const greeting = [...PURE_GREETINGS[locale]]
      .find((candidate) => normalized.startsWith(`${candidate} `));
    if (greeting && HELP_QUESTIONS[locale].has(normalized.slice(greeting.length + 1))) {
      return DETERMINISTIC_REPLIES[locale].help;
    }
  }

  if (HELP_QUESTIONS[locale].has(normalized)) {
    return DETERMINISTIC_REPLIES[locale].help;
  }

  const asksPythonExperience = normalized.includes("python")
    && /\b(experiencia|experience)\b/.test(normalized);
  if (asksPythonExperience) {
    const startsWithGreeting = [...PURE_GREETINGS[locale]]
      .some((greeting) => normalized.startsWith(`${greeting} `));
    const greeting = startsWithGreeting ? (locale === "es" ? "¡Hola! " : "Hi! ") : "";
    return `${greeting}${DETERMINISTIC_REPLIES[locale].python}`;
  }

  const asksRustExperience = normalized.includes("rust")
    && /\b(experiencia|experience|stack|tecnologia|technology|sabe|know|uses|use|en|con|about)\b/.test(normalized);
  if (asksRustExperience) {
    return DETERMINISTIC_REPLIES[locale].rust;
  }

  return null;
}

export function detectChatLocale(
  question: string,
  preferredLocale?: ChatLocale,
): ChatLocale {
  const normalized = searchable(question);
  const hasEnglish = ENGLISH_HINTS.test(normalized);
  const hasSpanish = SPANISH_HINTS.test(normalized);

  if (hasEnglish && !hasSpanish) return "en";
  if (hasSpanish && !hasEnglish) return "es";
  return preferredLocale ?? (hasEnglish ? "en" : "es");
}

export function selectChatTopics(question: string): ChatTopic[] {
  if (isCredentialCountQuestion(question)) return ["credentials"];

  const normalized = searchable(question);
  const topics = (Object.entries(TOPIC_TERMS) as Array<[
    Exclude<ChatTopic, "profile">,
    string[],
  ]>)
    .filter(([, terms]) => terms.some((term) => normalized.includes(searchable(term))))
    .map(([topic]) => topic);

  return topics.length > 0 ? topics : ["profile"];
}

function profileContext(locale: ChatLocale): string {
  const role = locale === "es" ? profile.currentRoleEs : profile.currentRoleEn;
  return [
    `Name: ${profile.name}`,
    `Role: ${role} at ${profile.currentCompany}`,
    `Location: ${profile.location}`,
    `Summary: ${profile.summary}`,
  ].join("\n");
}

function experienceContext(question: string, locale: ChatLocale): string {
  const normalized = searchable(question);
  const allTechnologies = skills.flatMap((group) => group.skillsEn);
  const mentionedTechnologies = allTechnologies.filter((technology) =>
    normalized.includes(searchable(technology)),
  );

  const relevantExperience = mentionedTechnologies.length > 0
    ? experience.filter((item) =>
        [...item.stackEs, ...item.stackEn].some((technology) =>
          mentionedTechnologies.some(
            (mentioned) => searchable(mentioned) === searchable(technology),
          ),
        ),
      )
    : experience;

  const relevantSkills = mentionedTechnologies.length > 0
    ? mentionedTechnologies
    : skills.flatMap((group) => locale === "es" ? group.skillsEs : group.skillsEn);

  const roles = relevantExperience.map((item) => {
    const role = locale === "es" ? item.roleEs : item.roleEn;
    const summary = locale === "es" ? item.summaryEs : item.summaryEn;
    const stack = locale === "es" ? item.stackEs : item.stackEn;
    return `${role} at ${item.company}: ${summary} Stack: ${stack.join(", ")}.`;
  });

  return [`Skills: ${relevantSkills.join(", ")}.`, ...roles].join("\n");
}

function credentialsContext(locale: ChatLocale): string {
  const certifications = cv.certifications.flatMap((group) =>
    group.items.map((item) => `${item.title} — ${item.detailEs ?? item.detailEn ?? group.group}`),
  );
  const education = cv.education.flatMap((group) =>
    group.items.map((item) => `${group.group}: ${locale === "es" ? item.es : item.en}`),
  );
  return [`Credentials: ${certifications.join("; ")}.`, `Education: ${education.join("; ")}.`].join("\n");
}

function projectsContext(locale: ChatLocale): string {
  return projects.map((project) => {
    const context = locale === "es" ? project.contextEs : project.contextEn;
    const role = locale === "es" ? project.roleEs : project.roleEn;
    const description = locale === "es" ? project.descriptionEs : project.descriptionEn;
    return `${project.title} (${context}; ${role}): ${description} Stack: ${project.stack.join(", ")}.`;
  }).join("\n");
}

function contactContext(locale: ChatLocale): string {
  return socialLinks.map((link) => {
    const label = locale === "es" ? link.labelEs : link.labelEn;
    return `${label}: ${link.url}`;
  }).join("\n");
}

export interface SelectedChatContext {
  locale: ChatLocale;
  topics: ChatTopic[];
  context: string;
}

export function buildChatContext(
  question: string,
  preferredLocale?: ChatLocale,
): SelectedChatContext {
  const locale = detectChatLocale(question, preferredLocale);
  const topics = selectChatTopics(question);
  const sections = topics.map((topic) => {
    switch (topic) {
      case "experience": return experienceContext(question, locale);
      case "credentials": return credentialsContext(locale);
      case "projects": return projectsContext(locale);
      case "contact": return contactContext(locale);
      default: return profileContext(locale);
    }
  });

  return { locale, topics, context: sections.join("\n") };
}

export function createChatSystemPrompt(
  question: string,
  preferredLocale?: ChatLocale,
): string {
  const { locale, context } = buildChatContext(question, preferredLocale);
  const language = locale === "es" ? "Spanish" : "English";

  return `You answer questions only about Antonio Gaspar, using ONLY VERIFIED CONTEXT below.
Reply in ${language} with a warm, confident, and professional tone. Put the essential answer first. Default: at most 2 sentences AND 45 words total. For meta questions about how you can help: exactly 1 sentence, at most 25 words. Use at most 3 one-line bullets only when the user explicitly requests a list or comparison. Never repeat the same fact using synonyms such as stack, skill, and experience. No repetition, closing summary, Markdown, headings, tables, bold, italics, backticks, or Markdown links.
Do not add a greeting unless the user's message includes one. If a substantive question includes a greeting, briefly reciprocate and answer within the same 2-sentence limit.
Never infer technologies, duties, outcomes, dates, or projects. Lead with what IS verified. Do not default to defensive phrases such as "no hay detalle público", "no consta", "no está probado", or their English equivalents. If precision is limited, positively emphasize the verified focus, for example: "El perfil destaca principalmente X." Only say a detail is unavailable when the user explicitly requests that exact detail and it is essential to answer. For unrelated requests, briefly offer information about Antonio's experience, credentials, projects, or contact.
Never generate, explain, correct, or offer to produce code; never solve calculations; and never answer general-knowledge requests. Do not offer to perform an excluded task. If an excluded request reaches the model, redirect in one short sentence to Antonio's experience, technologies, credentials, or projects, without adding a biography.
Python wording rule: "Python forma parte del stack de su rol actual como Integrador de Sistemas, donde participa en integración, automatización y mejora continua de aplicaciones web." Translate faithfully to English when needed; do not claim backend, AWS, or specific Python projects.

VERIFIED CONTEXT
${context}`;
}
