export const INTRO_SESSION_KEY = "no-limits-intro-seen";

export const INTRO_TIMING = {
  resolve: 1_050,
  exit: 1_700,
  exitDuration: 650,
} as const;

export const INTRO_COPY = {
  es: {
    ariaLabel: "Presentación inicial del portfolio de Antonio Gaspar",
    systemLabel: "SISTEMA DE PORTFOLIO",
    skip: "SALTAR INTRO",
    resolved: "INTEGRADOR DE SISTEMAS ENCONTRADO",
    online: "ONLINE // PERFIL LISTO",
    match: "COINCIDENCIA DE PERFIL",
  },
  en: {
    ariaLabel: "Antonio Gaspar portfolio introduction",
    systemLabel: "PORTFOLIO SYSTEM",
    skip: "SKIP INTRO",
    resolved: "SYSTEMS INTEGRATOR FOUND",
    online: "ONLINE // PROFILE READY",
    match: "PROFILE MATCH",
  },
} as const;

export function shouldShowIntro(
  sessionValue: string | null,
  reducedMotion: boolean,
  isReload = false,
) {
  return !reducedMotion && (sessionValue === null || isReload);
}
