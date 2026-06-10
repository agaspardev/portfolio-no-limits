import {
  Award,
  BadgeCheck,
  Calendar,
  Cloud,
  Code2,
  Database,
  FileDown,
  FileText,
  GitBranch,
  Link,
  Mail,
  MonitorCog,
  Radar,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
  FlaskConical,
  FolderGit2,
  Rocket,
  Workflow,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";

function LinkedinIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M6.94 6.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88ZM5.5 8.25h2.88V18.5H5.5V8.25Zm4.45 0h2.76v1.4h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.39v5.94h-2.88v-5.27c0-1.26-.02-2.87-1.75-2.87-1.75 0-2.02 1.37-2.02 2.78v5.36H9.95V8.25Z" />
    </svg>
  );
}

function InstagramIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10A4.5 4.5 0 0 1 17 21.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5Zm0 1.5A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 2.5A5.5 5.5 0 1 1 6.5 12 5.51 5.51 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Zm6.25-2.1a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z" />
    </svg>
  );
}

const icons: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Calendar,
  Cloud,
  Code2,
  Database,
  FileDown,
  FileText,
  GitBranch,
  Link,
  linkedin: LinkedinIcon as unknown as LucideIcon,
  instagram: InstagramIcon as unknown as LucideIcon,
  Mail,
  MonitorCog,
  Radar,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
  FlaskConical,
  FolderGit2,
  Rocket,
  Workflow,
  BriefcaseBusiness,
};

interface IconResolverProps {
  name: string;
  size?: number;
  className?: string;
}

export function IconResolver({ name, size = 18, className }: IconResolverProps) {
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return null;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
