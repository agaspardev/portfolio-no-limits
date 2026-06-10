"use client";

import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";

export function Footer() {
  const year = new Date().getFullYear();
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale].footer;
  const iconButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors";
  const iconButtonStyle =
    theme === "dark"
      ? {
          borderColor: "rgba(30, 41, 59, 0.85)",
          color: "rgb(148, 163, 184)",
        }
      : {
          borderColor: "rgba(15, 23, 42, 0.12)",
          color: "rgb(71, 85, 105)",
        };

  return (
    <footer
      className="relative z-10 py-12"
      style={{
        background:
          theme === "dark"
            ? "rgba(2, 6, 23, 0.92)"
            : "rgba(248, 250, 252, 0.96)",
        borderTop: theme === "dark" ? "1px solid rgba(30, 41, 59, 0.60)" : "1px solid rgba(15, 23, 42, 0.08)",
      }}
      role="contentinfo"
    >
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left — Identity */}
          <div className="text-center md:text-left">
            <p className="font-mono text-xs tracking-[0.18em] text-cyan-400 uppercase mb-1">
              NO LIMITS
            </p>
            <p className="text-sm font-medium text-slate-200">Antonio Gaspar</p>
            <p className="text-xs text-slate-500 mt-0.5">{t.tagline}</p>
          </div>

          {/* Center — Credential links */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/antoniogasparr/"
              target="_blank"
              rel="noreferrer"
              aria-label={t.linkedin}
              className={iconButtonClass}
              style={iconButtonStyle}
            >
              <IconResolver name="linkedin" size={16} className="text-inherit" />
            </a>
            <a
              href="https://www.instagram.com/gass_parr/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={iconButtonClass}
              style={iconButtonStyle}
            >
              <IconResolver name="instagram" size={16} className="text-inherit" />
            </a>
            <a
              href="https://www.credly.com/users/antonio-gaspar.d79e2688/badges#credly"
              target="_blank"
              rel="noreferrer"
              aria-label={t.credly}
              className={iconButtonClass}
              style={iconButtonStyle}
            >
              <IconResolver name="Award" size={16} className="text-inherit" />
            </a>
            <a
              href="https://profiles.badgeclaimed.com/user-353926/index.html"
              target="_blank"
              rel="noreferrer"
              aria-label={t.badgeclaimed}
              className={iconButtonClass}
              style={iconButtonStyle}
            >
              <IconResolver name="BadgeCheck" size={16} className="text-inherit" />
            </a>
          </div>

          {/* Right — Credits */}
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-600">
              {t.credits}
            </p>
            <p className="text-xs text-slate-700 mt-0.5">
              {t.copyright.replace("{year}", String(year))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
