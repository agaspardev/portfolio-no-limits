export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://no-limits.vercel.app";

export const CREDENTIAL_LINKS = {
  credly: "https://www.credly.com/users/antonio-gaspar.d79e2688/badges#credly",
  badgeclaimed: "https://profiles.badgeclaimed.com/user-353926/index.html",
  linkedin: "https://www.linkedin.com/in/antoniogasparr",
} as const;

export const CERT_FILTER_LABELS = [
  "Todas",
  "Cloud",
  "Microsoft",
  "AWS",
  "DevOps",
  "AI",
  "Security",
  "Agile",
  "PM",
  "Data",
] as const;

export const STATUS_VARIANT_LABELS: Record<string, string> = {
  verified: "Verificado",
  issued: "Emitido",
  applied: "Aplicado",
  operational: "Operativo",
  learning: "Ruta de aprendizaje",
  emerging: "Emergente",
  core: "Core",
};
