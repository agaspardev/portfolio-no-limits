import type { ChatLocale } from "./chat-context";

export type ChatFailureKind =
  | "timeout"
  | "rate-limit"
  | "unavailable"
  | "invalid-request"
  | "network"
  | "unknown";

export class ChatHttpError extends Error {
  constructor(public readonly status: number) {
    super(`Chat request failed with status ${status}`);
    this.name = "ChatHttpError";
  }
}

export function classifyChatFailure(error: unknown): ChatFailureKind {
  if (error instanceof ChatHttpError) {
    if (error.status === 429) return "rate-limit";
    if (error.status === 400 || error.status === 422) return "invalid-request";
    if (error.status === 503 || error.status >= 500) return "unavailable";
    return "unknown";
  }

  if (error instanceof Error && error.name === "AbortError") return "timeout";
  if (error instanceof TypeError) return "network";
  return "unknown";
}

const MESSAGES: Record<ChatLocale, Record<ChatFailureKind, string>> = {
  es: {
    timeout: "La respuesta tardó demasiado. Inténtalo nuevamente en unos segundos.",
    "rate-limit": "Hay muchas consultas en este momento. Espera un minuto y vuelve a intentarlo.",
    unavailable: "El asistente está temporalmente fuera de servicio. Puedes seguir explorando el portfolio o usar la sección Contacto.",
    "invalid-request": "No pude interpretar esa solicitud. Reformúlala en una frase breve.",
    network: "No pude conectar con el asistente. Revisa tu conexión e inténtalo nuevamente.",
    unknown: "No pude completar la consulta. Inténtalo nuevamente o usa la sección Contacto.",
  },
  en: {
    timeout: "The response took too long. Please try again in a few seconds.",
    "rate-limit": "There are many requests right now. Wait a minute and try again.",
    unavailable: "The assistant is temporarily unavailable. You can keep exploring the portfolio or use the Contact section.",
    "invalid-request": "I couldn't interpret that request. Please rephrase it in one short sentence.",
    network: "I couldn't connect to the assistant. Check your connection and try again.",
    unknown: "I couldn't complete the request. Please try again or use the Contact section.",
  },
};

export function getChatFailureMessage(kind: ChatFailureKind, locale: ChatLocale): string {
  return MESSAGES[locale][kind];
}
