export type StatusVariant =
  | "verified"
  | "issued"
  | "applied"
  | "operational"
  | "learning"
  | "emerging"
  | "core";

export interface SiteConfig {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  language: string;
  locale: string;
  theme: "dark" | "light";
  concept: string;
  author: string;
  keywords: string[];
  ui?: {
    defaultLocale: "es" | "en";
    sections?: Record<string, boolean>;
  };
  openGraph: {
    url: string;
    image: string;
    type: string;
  };
}

export interface HeroChip {
  label: string;
  icon: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  heroEyebrow: string;
  tagline: string;
  taglineSub: string;
  summary: string;
  about: string[];
  profileImage: {
    src: string;
    alt: string;
    placeholder: string;
  };
  status: {
    label: string;
    variant: StatusVariant;
  };
  focusAreas: string[];
  heroChips: HeroChip[];
  operationalSignature: {
    order: string;
    text: string;
  }[];
}

export interface SkillGroup {
  id: string;
  titleEs: string;
  titleEn: string;
  icon: string;
  descriptionEs: string;
  descriptionEn: string;
  statusEs: string;
  statusEn: string;
  statusVariant: StatusVariant;
  skillsEs: string[];
  skillsEn: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  roleEs: string;
  roleEn: string;
  periodEs: string;
  periodEn: string;
  periodLabelEs: string;
  periodLabelEn: string;
  location: string;
  typeEs: string;
  typeEn: string;
  isCurrent: boolean;
  summaryEs: string;
  summaryEn: string;
  stackEs: string[];
  stackEn: string[];
  impactEs: string[];
  impactEn: string[];
  categoryEs: string[];
  categoryEn: string[];
}

export interface Certification {
  id: string;
  name: string;
  code: string;
  issuer: string;
  issuerInitials: string;
  category: string;
  subcategory: string;
  status: string;
  statusVariant: StatusVariant;
  credentialUrl: string;
  logo: string;
  skills: string[];
  filters: string[];
}

export interface Project {
  id: string;
  title: string;
  group: string;
  context: string;
  role: string;
  priority: number;
  type: string;
  status: string;
  statusVariant: StatusVariant;
  description: string;
  contribution: string[];
  impact: string[];
  stack: string[];
  highlights: string[];
  repositoryUrl: string;
  demoUrl: string;
  icon: string;
}

export interface SocialLink {
  id: string;
  labelEs: string;
  labelEn: string;
  url: string;
  icon: string;
  type: "professional" | "credentials" | "code" | "contact" | "booking";
  isPrimary: boolean;
  descriptionEs: string;
  descriptionEn: string;
}

export interface CVSummaryArea {
  label: string;
  icon: string;
  description: string;
}

export interface CVData {
  title: string;
  eyebrow: string;
  description: string;
  downloadLabel: string;
  fileUrl: string;
  files: {
    label: string;
    href: string;
    language: string;
    isPrimary: boolean;
  }[];
  certifications: {
    group: string;
    items: {
      title: string;
      href: string;
      detail: string | null;
      tag?: string;
      filters?: string[];
    }[];
  }[];
  courses: {
    group: string;
    items: {
      title: string;
      href: string | null;
      detail: string | null;
    }[];
  }[];
  education: {
    group: string;
    items: string[];
  }[];
  snapshot: string[];
  summaryAreas: CVSummaryArea[];
}

export interface NavItem {
  labelEs: string;
  labelEn: string;
  href: string;
  visible?: boolean;
}
