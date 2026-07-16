import cv from "@/data/cv.json";
import experience from "@/data/experience.json";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import skills from "@/data/skills.json";
import socialLinks from "@/data/social-links.json";
import { copy } from "@/data/copy";
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
    unintelligible: "No pude entender tu mensaje. Puedes preguntarme sobre la experiencia, certificaciones o proyectos de Antonio.",
  },
  en: {
    greeting: "Hi! Happy to help. You can ask me about Antonio's experience, technologies, certifications, or projects.",
    help: "Of course! I can help with Antonio's experience, technologies, certifications, projects, or contact details.",
    python: "Python is part of his current stack as a Systems Integrator, where he contributes to integration, automation, and continuous improvement of web applications.",
    rust: "Rust is not part of Antonio's published professional stack.",
    coding: "I can tell you about Antonio's professional experience with Python, but this assistant does not generate code or solve programming tasks.",
    general: "This assistant focuses on Antonio's professional profile. I can help with his experience, technologies, certifications, or projects.",
    unintelligible: "I couldn't understand your message. You can ask about Antonio's experience, certifications, or projects.",
  },
} satisfies Record<ChatLocale, Record<"greeting" | "help" | "python" | "rust" | "coding" | "general" | "unintelligible", string>>;

// ── Deterministic profile responses ──────────────────────────────────────────
const PROFILE_RESPONSES: Record<ChatLocale, Record<string, string>> = {
  es: {
    whois: `${profile.name} es ${profile.currentRoleEs} en ${profile.currentCompany}, ubicado en ${profile.location}.`,
    role: `Antonio es ${profile.currentRoleEs} en ${profile.currentCompany}.`,
    company: `Antonio trabaja en ${profile.currentCompany} como ${profile.currentRoleEs}.`,
    location: `Antonio está ubicado en ${profile.location}.`,
    summary: copy.es.hero.summary,
    focus: `Las áreas de enfoque de Antonio son: ${profile.focusAreas.join(", ")}.`,
    about: copy.es.sections.profile.about.join(" "),
    motto: `El lema de Antonio es "${profile.status.label}".`,
    signature: profile.operationalSignature.map((s) => `${s.order}. ${s.textEs}`).join("\n"),
  },
  en: {
    whois: `${profile.name} is a ${profile.currentRoleEn} at ${profile.currentCompany}, based in ${profile.location}.`,
    role: `Antonio is a ${profile.currentRoleEn} at ${profile.currentCompany}.`,
    company: `Antonio works at ${profile.currentCompany} as a ${profile.currentRoleEn}.`,
    location: `Antonio is based in ${profile.location}.`,
    summary: copy.en.hero.summary,
    focus: `Antonio's focus areas are: ${profile.focusAreas.join(", ")}.`,
    about: copy.en.sections.profile.about.join(" "),
    motto: `Antonio's motto is "${profile.status.label}".`,
    signature: profile.operationalSignature.map((s) => `${s.order}. ${s.textEn}`).join("\n"),
  },
};

// ── Deterministic experience responses ───────────────────────────────────────
const EXPERIENCE_RESPONSES: Record<ChatLocale, string> = {
  es: `Antonio cuenta con experiencia como ${experience.map((e) => e.roleEs).join(", ")}. Actualmente es ${profile.currentRoleEs} en ${profile.currentCompany}, con foco en integración, automatización y mejora continua.`,
  en: `Antonio has worked as ${experience.map((e) => e.roleEn).join(", ")}. He currently works as a ${profile.currentRoleEn} at ${profile.currentCompany}, focused on integration, automation, and continuous improvement.`,
};

// ── Deterministic skills responses ───────────────────────────────────────────
const SKILLS_RESPONSES: Record<ChatLocale, string> = {
  es: `Sus capacidades abarcan ${skills.map((g) => g.titleEs).join(", ")}. Su stack principal incluye Angular, .NET/C#, Node.js, Python, Azure y AWS.`,
  en: `His capabilities cover ${skills.map((g) => g.titleEn).join(", ")}. His core stack includes Angular, .NET/C#, Node.js, Python, Azure, and AWS.`,
};

// ── Deterministic certification responses ────────────────────────────────────
const CERTS = cv.certifications.flatMap((g) => g.items);
const CERTS_RESPONSES: Record<ChatLocale, string> = {
  es: `Antonio tiene ${CERTS.length} credenciales profesionales publicadas, con foco en Azure, cloud, DevOps, IA, ciberseguridad, agilidad y gestión de proyectos.`,
  en: `Antonio has ${CERTS.length} published professional credentials focused on Azure, cloud, DevOps, AI, cybersecurity, agility, and project management.`,
};

// ── Deterministic project responses ──────────────────────────────────────────
const PROJECTS_RESPONSES: Record<ChatLocale, string> = {
  es: `El portfolio presenta ${projects.length} casos empresariales anonimizados: ${projects.map((p) => p.title).join(", ")}. Puedes preguntarme por uno para ver su contribución y stack.`,
  en: `The portfolio presents ${projects.length} anonymized enterprise cases: ${projects.map((p) => p.title).join(", ")}. Ask about one to see Antonio's contribution and stack.`,
};

// ── Deterministic education responses ────────────────────────────────────────
const EDUCATION_RESPONSES: Record<ChatLocale, string> = {
  es: `La formación publicada de Antonio incluye ${cv.education.flatMap((g) => g.items.map((item) => item.es)).join("; ")}.`,
  en: `Antonio's published education includes ${cv.education.flatMap((g) => g.items.map((item) => item.en)).join("; ")}.`,
};

// ── Deterministic social links responses ─────────────────────────────────────
const publicSocial = (id: string) => socialLinks.find((link) => link.id === id)?.url;
const SOCIAL_RESPONSES: Record<ChatLocale, string> = {
  es: `Puedes encontrar a Antonio en LinkedIn (${publicSocial("linkedin")}), Credly (${publicSocial("credly")}) e Instagram (${publicSocial("instagram")}).`,
  en: `You can find Antonio on LinkedIn (${publicSocial("linkedin")}), Credly (${publicSocial("credly")}), and Instagram (${publicSocial("instagram")}).`,
};

// ── Deterministic CV download responses ──────────────────────────────────────
const CV_RESPONSES: Record<ChatLocale, string> = {
  es: `El CV de Antonio está disponible en 3 versiones: Español, Inglés y Bilingüe. Puedes descargarlo desde la sección CV del portfolio.`,
  en: `Antonio's CV is available in 3 versions: Spanish, English, and Bilingual. You can download it from the CV section of the portfolio.`,
};

// ── Pattern matchers for deterministic responses ─────────────────────────────
const WHO_IS = /\b(quien es|que es|quién es|quien es antonio|que hace antonio|who is|who's|what does antonio do|tell me about antonio|about antonio|cuéntame de antonio|cuantame de antonio|hablame de antonio|hablame de antonio| Tell me about)\b/i;
const ANTONIO_NAME = /^(antonio|antonio gaspar)$/i;
const ROLE_QUESTION = /\b(rol|cargo|position|role|puesto|trabaja de|what does he do|que hace)\b/i;
const COMPANY_QUESTION = /\b(empresa|company|donde trabaja|where does he work|que empresa|which company)\b/i;
const LOCATION_QUESTION = /\b(ubicacion|ubicación|location|donde esta|where is|dónde está|pais|country|ciudad|city|chile)\b/i;
const SUMMARY_QUESTION = /\b(resumen|summary|overview|descripcion|describe|que sabes|what do you know)\b/i;
const FOCUS_QUESTION = /\b(enfoque|focus|area|areas|que le interesa|what interests|specialty|specialties|especialidad)\b/i;
const ABOUT_QUESTION = /\b(sobre antonio|about antonio|cuéntame|cuéntame más|tell me more|tell me about|habla de|speak about)\b/i;
const MOTTO_QUESTION = /\b(motto|lema|frase|quote|slogan|no limits)\b/i;
const SIGNATURE_QUESTION = /\b(firma|signature|principios|principles|valores|values|operational)\b/i;

const EXPERIENCE_QUESTION = /\b(experiencia|experience|trabajo|work|empleo|job|historial|history|career| trayectoria)\b/i;
const STACK_QUESTION = /\b(stack|tecnologías|technologies|tech|skills|habilidades|what technologies|que tecnologias|que usa|what does he use)\b/i;
const SPECIFIC_COMPANY = /\b(innobyte|traza|coasin)\b/i;
const SPECIFIC_ROLE = /\b(integrador|full.?stack|programador|analista de vulnerabilidades|systems integrator|developer|vulnerability)\b/i;

const SKILLS_QUESTION = /\b(capacidades|capabilities|skills|habilidades|technologies|tecnologías|que sabe|what can he|que sabe hacer)\b/i;
const SPECIFIC_SKILL = /\b(angular|react|node|\.net|python|java|azure|aws|docker|kubernetes|sql|typescript|javascript)\b/i;

const CERTS_QUESTION = /\b(certificaciones?|certifications?|certificados?|certificates?|credenciales?|credentials?|credly|badges?)\b/i;
const SPECIFIC_CERT = /\b(azure|az.?900|dp.?900|ai.?900|devops|scrum|cyber|security|cloud|data|ai|agile|pmp|pm)\b/i;

const PROJECTS_QUESTION = /\b(proyectos?|projects?|casos?|cases?|work cases?|portafolio|portfolio|plataforma|platform)\b/i;
const SPECIFIC_PROJECT = /\b(energy|mobility|cloud|loyalty|copec|tct|neotac|cupon)\b/i;

const EDUCATION_QUESTION = /\b(educación|education|formación|formation|estudios|studies|universidad|university|instituto|institute|carrera|degree|titulo|title|bootcamp|curso|course)\b/i;

const SOCIAL_QUESTION = /\b(redes|social|linkedin|instagram|credly|email|correo|contacto|contact)\b/i;

const CV_QUESTION = /\b(cv|curriculum|currículum|resume|descargar|download|bajada)\b/i;

const TECH_QUESTIONS: Record<string, Record<ChatLocale, string>> = {
  angular: {
    es: "Angular es una de las principales tecnologías de Antonio. Lo usa en su rol actual en Innobyte para desarrollo de aplicaciones web enterprise.",
    en: "Angular is one of Antonio's core technologies. He uses it in his current role at Innobyte for enterprise web application development.",
  },
  react: {
    es: "React forma parte del stack de desarrollo de Antonio, junto con React Native para aplicaciones móviles.",
    en: "React is part of Antonio's development stack, along with React Native for mobile applications.",
  },
  python: {
    es: "Python forma parte del stack de su rol actual como Integrador de Sistemas, donde participa en integración, automatización y mejora continua de aplicaciones web.",
    en: "Python is part of his current stack as a Systems Integrator, where he contributes to integration, automation, and continuous improvement of web applications.",
  },
  node: {
    es: "Node.js es parte del stack backend de Antonio, utilizado en desarrollo de APIs y servicios.",
    en: "Node.js is part of Antonio's backend stack, used for API and service development.",
  },
  dotnet: {
    es: ".NET/C# es una de las tecnologías principales de Antonio, utilizada en desarrollo backend enterprise.",
    en: ".NET/C# is one of Antonio's core technologies, used in enterprise backend development.",
  },
  azure: {
    es: "Azure es la plataforma cloud principal de Antonio. Tiene certificaciones AZ-900, DP-900 y AI-900 de Microsoft.",
    en: "Azure is Antonio's primary cloud platform. He holds Microsoft certifications AZ-900, DP-900, and AI-900.",
  },
  aws: {
    es: "AWS es parte del stack cloud de Antonio. Ha trabajado con Lambda, DynamoDB, S3 y servicios serverless.",
    en: "AWS is part of Antonio's cloud stack. He has worked with Lambda, DynamoDB, S3, and serverless services.",
  },
  devops: {
    es: "DevOps es un área clave de Antonio: Git, GitHub Workflows, CI/CD, Scrum. Tiene certificaciones DEPC y DFPC.",
    en: "DevOps is a key area for Antonio: Git, GitHub Workflows, CI/CD, Scrum. He holds DEPC and DFPC certifications.",
  },
  rust: {
    es: DETERMINISTIC_REPLIES.es.rust,
    en: DETERMINISTIC_REPLIES.en.rust,
  },
};

const TECH_ALIASES: Record<keyof typeof TECH_QUESTIONS, string[]> = {
  angular: ["angular"],
  react: ["react", "react native"],
  python: ["python"],
  node: ["node", "node js", "nodejs"],
  dotnet: ["net", "dotnet", "c sharp"],
  azure: ["azure"],
  aws: ["aws"],
  devops: ["devops"],
  rust: ["rust"],
};

function findTechnology(normalized: string): keyof typeof TECH_QUESTIONS | null {
  return (Object.entries(TECH_ALIASES) as Array<[keyof typeof TECH_QUESTIONS, string[]]>)
    .find(([, aliases]) => aliases.some((alias) =>
      new RegExp(`\\b${alias.replace(/ /g, "\\s+")}\\b`).test(normalized),
    ))?.[0] ?? null;
}

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

  if (CODE_ACTION.test(normalized) && CODE_ARTIFACT.test(normalized)) return "coding";
  if (MATH_REQUEST.test(normalizedWithOperators)) return "math";
  if (GENERAL_KNOWLEDGE.test(normalized)) return "general";
  return null;
}

/**
 * Detects gibberish, random keystrokes, or otherwise unintelligible input.
 * Returns true if the message is too short, mostly non-alpha, or lacks
 * recognizable words in any supported language.
 */
function isUnintelligible(normalized: string): boolean {
  // Empty or whitespace-only
  if (!normalized) return true;

  // Too short to be meaningful (1-2 chars, no vowels)
  if (normalized.length <= 2 && !/[aeiouáéíóú]/i.test(normalized)) return true;

  // Check ratio of alphabetic chars — if < 50%, it's likely gibberish
  const alphaCount = (normalized.match(/[a-záéíóúñ]/gi) ?? []).length;
  const ratio = alphaCount / normalized.length;
  if (ratio < 0.5 && normalized.length <= 10) return true;

  // Has recognizable words in either language — not gibberish
  if (ENGLISH_HINTS.test(normalized) || SPANISH_HINTS.test(normalized)) return false;

  // Single non-dictionary word under 8 chars — likely gibberish
  if (normalized.length <= 8 && !normalized.includes(" ")) return true;

  return false;
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

/**
 * Returns stable, zero-token responses for greetings, help, profile,
 * experience, skills, certifications, projects, education, social links,
 * and verified common FAQs.
 */
export function getDeterministicChatResponse(
  question: string,
  preferredLocale?: ChatLocale,
  history: ChatMessage[] = [],
): string | null {
  const normalized = conversationalText(question);

  // 1. Excluded scope (coding, math, general knowledge)
  const excludedScope = contextualExcludedScope(question, history);
  if (excludedScope) {
    const locale = detectChatLocale(question, preferredLocale);
    return excludedScope === "coding"
      ? DETERMINISTIC_REPLIES[locale].coding
      : DETERMINISTIC_REPLIES[locale].general;
  }

  const locale = detectChatLocale(question, preferredLocale);

  // 1b. Name-only input — "antonio", "antonio gaspar"
  if (ANTONIO_NAME.test(normalized)) return PROFILE_RESPONSES[locale].whois;

  // 2. Contact responses
  const contactResponse = getContactResponse(question, locale);
  if (contactResponse) return contactResponse;

  // 3. Credential count responses
  const credentialCountResponse = getCredentialCountResponse(question, locale, history);
  if (credentialCountResponse) return credentialCountResponse;

  // 4. Greetings
  for (const loc of ["es", "en"] as const) {
    if (PURE_GREETINGS[loc].has(normalized)) {
      return DETERMINISTIC_REPLIES[loc].greeting;
    }
    const greeting = [...PURE_GREETINGS[loc]]
      .find((candidate) => normalized.startsWith(`${candidate} `));
    if (greeting && HELP_QUESTIONS[loc].has(normalized.slice(greeting.length + 1))) {
      return DETERMINISTIC_REPLIES[loc].help;
    }
  }

  // 5. Help questions
  if (HELP_QUESTIONS[locale].has(normalized)) {
    return DETERMINISTIC_REPLIES[locale].help;
  }

  // 6. Profile questions (deterministic, zero tokens)
  if (WHO_IS.test(normalized)) return PROFILE_RESPONSES[locale].whois;
  if (ROLE_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].role;
  if (COMPANY_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].company;
  if (LOCATION_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].location;
  if (SUMMARY_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].summary;
  if (FOCUS_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].focus;
  if (ABOUT_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].about;
  if (MOTTO_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].motto;
  if (SIGNATURE_QUESTION.test(normalized)) return PROFILE_RESPONSES[locale].signature;

  // 7. Python/Rust experience questions (specific, BEFORE technology questions)
  const asksPythonExperience = normalized.includes("python")
    && /\b(experiencia|experience|stack|tecnologia|technology)\b/.test(normalized);
  if (asksPythonExperience) {
    const startsWithGreeting = [...PURE_GREETINGS[locale]]
      .some((greeting) => normalized.startsWith(`${greeting} `));
    const greetingPrefix = startsWithGreeting ? (locale === "es" ? "¡Hola! " : "Hi! ") : "";
    return `${greetingPrefix}${DETERMINISTIC_REPLIES[locale].python}`;
  }
  const asksRustExperience = normalized.includes("rust")
    && /\b(experiencia|experience|stack|tecnologia|technology|sabe|know|uses|use|en|con|about)\b/.test(normalized);
  if (asksRustExperience) {
    return DETERMINISTIC_REPLIES[locale].rust;
  }

  // 8. Specific technology questions (deterministic, zero tokens)
  const technology = findTechnology(normalized);
  if (technology) {
    return TECH_QUESTIONS[technology][locale];
  }

  // 9. Experience questions (deterministic, zero tokens)
  if (EXPERIENCE_QUESTION.test(normalized)) {
    if (SPECIFIC_COMPANY.test(normalized)) {
      const companyMatch = normalized.match(/\b(innobyte|traza|coasin)\b/)?.[0];
      const relevant = experience.filter((e) =>
        searchable(e.company).includes(companyMatch ?? ""),
      );
      if (relevant.length > 0) {
        const e = relevant[0];
        const role = locale === "es" ? e.roleEs : e.roleEn;
        const summary = locale === "es" ? e.summaryEs : e.summaryEn;
        const stack = (locale === "es" ? e.stackEs : e.stackEn).join(", ");
        return locale === "es"
          ? `${role} en ${e.company}: ${summary} Stack: ${stack}.`
          : `${role} at ${e.company}: ${summary} Stack: ${stack}.`;
      }
    }
    if (SPECIFIC_ROLE.test(normalized)) {
      const roleMatch = normalized.match(/\b(integrador|full.?stack|programador|analista|developer|vulnerability)\b/)?.[0];
      const relevant = experience.filter((e) => {
        const roleEs = searchable(e.roleEs);
        const roleEn = searchable(e.roleEn);
        return roleEs.includes(roleMatch ?? "") || roleEn.includes(roleMatch ?? "");
      });
      if (relevant.length > 0) {
        const e = relevant[0];
        const role = locale === "es" ? e.roleEs : e.roleEn;
        const summary = locale === "es" ? e.summaryEs : e.summaryEn;
        const stack = (locale === "es" ? e.stackEs : e.stackEn).join(", ");
        return locale === "es"
          ? `${role} en ${e.company}: ${summary} Stack: ${stack}.`
          : `${role} at ${e.company}: ${summary} Stack: ${stack}.`;
      }
    }
    return EXPERIENCE_RESPONSES[locale];
  }

  // 8. Stack/technology questions (deterministic, zero tokens)
  if (STACK_QUESTION.test(normalized) || SPECIFIC_SKILL.test(normalized)) {
    // Check for specific technology
    const matchedTechnology = findTechnology(normalized);
    if (matchedTechnology) {
      return TECH_QUESTIONS[matchedTechnology][locale];
    }
    return SKILLS_RESPONSES[locale];
  }

  // 9. Skills questions (deterministic, zero tokens)
  if (SKILLS_QUESTION.test(normalized)) {
    return SKILLS_RESPONSES[locale];
  }

  // 10. Certification questions (deterministic, zero tokens)
  if (CERTS_QUESTION.test(normalized)) {
    if (SPECIFIC_CERT.test(normalized)) {
      const certMatch = normalized.match(/\b(azure|az.?900|dp.?900|ai.?900|devops|scrum|cyber|security|cloud|data|ai|agile|pmp|pm)\b/)?.[0];
      const relevant = CERTS.filter((c) => {
        const title = searchable(c.title);
        return title.includes(certMatch ?? "");
      });
      if (relevant.length > 0) {
        return relevant.map((c) => `${c.title}.`).join(" ");
      }
    }
    return CERTS_RESPONSES[locale];
  }

  // 11. Project questions (deterministic, zero tokens)
  if (PROJECTS_QUESTION.test(normalized)) {
    if (SPECIFIC_PROJECT.test(normalized)) {
      const projectMatch = normalized.match(/\b(energy|mobility|cloud|loyalty|copec|tct|neotac|cupon)\b/)?.[0];
      const relevant = projects.filter((p) => {
        const text = searchable(`${p.title} ${p.contextEs} ${p.contextEn} ${p.id}`);
        return text.includes(projectMatch ?? "");
      });
      if (relevant.length > 0) {
        const p = relevant[0];
        const context = locale === "es" ? p.contextEs : p.contextEn;
        const role = locale === "es" ? p.roleEs : p.roleEn;
        const desc = locale === "es" ? p.descriptionEs : p.descriptionEn;
        return `${p.title} (${context}): ${role}. ${desc} Stack: ${p.stack.join(", ")}.`;
      }
    }
    return PROJECTS_RESPONSES[locale];
  }

  // 12. Education questions (deterministic, zero tokens)
  if (EDUCATION_QUESTION.test(normalized)) {
    return EDUCATION_RESPONSES[locale];
  }

  // 13. Social links questions (deterministic, zero tokens)
  if (SOCIAL_QUESTION.test(normalized)) {
    if (/\b(email|correo)\b/.test(normalized)) {
      const email = socialLinks.find((link) => link.id === "email")?.url.replace(/^mailto:/, "");
      return email
        ? (locale === "es" ? `Email: ${email}` : `Email: ${email}`)
        : (locale === "es" ? "Puedes usar la sección Contacto." : "You can use the Contact section.");
    }
    if (normalized.includes("linkedin")) {
      const link = socialLinks.find((l) => l.id === "linkedin");
      return link
        ? `LinkedIn: ${link.url}`
        : (locale === "es" ? "LinkedIn es el perfil profesional de Antonio." : "LinkedIn is Antonio's professional profile.");
    }
    if (normalized.includes("instagram")) {
      const link = socialLinks.find((l) => l.id === "instagram");
      return link
        ? `Instagram: ${link.url}`
        : (locale === "es" ? "Instagram es donde Antonio comparte contenido profesional." : "Instagram is where Antonio shares professional content.");
    }
    if (normalized.includes("credly")) {
      const link = socialLinks.find((l) => l.id === "credly");
      return link
        ? `Credly: ${link.url}`
        : (locale === "es" ? "Credly muestra las credenciales certificadas de Antonio." : "Credly shows Antonio's certified credentials.");
    }
    return SOCIAL_RESPONSES[locale];
  }

  // 14. CV download questions (deterministic, zero tokens)
  if (CV_QUESTION.test(normalized)) {
    return CV_RESPONSES[locale];
  }

  // Run the gibberish guard only after every valid command/domain intent.
  if (isUnintelligible(normalized)) {
    return DETERMINISTIC_REPLIES[locale].unintelligible;
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

  // Explicit language signals always win; UI locale resolves ambiguity only.
  if (hasEnglish && hasSpanish) return preferredLocale ?? "es";
  if (!hasEnglish && !hasSpanish) return preferredLocale ?? "es";
  if (hasSpanish) return "es";
  return "en";
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
  const summary = copy[locale].hero.summary;
  return [
    `Name: ${profile.name}`,
    `Role: ${role} at ${profile.currentCompany}`,
    `Location: ${profile.location}`,
    `Summary: ${summary}`,
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
    const description = locale === "es" ? link.descriptionEs : link.descriptionEn;
    return `${label}: ${link.url} — ${description}`;
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
