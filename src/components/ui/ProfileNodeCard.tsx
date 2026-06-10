import Image from "next/image";
import { MapPin, Activity } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import type { Profile } from "@/types/portfolio";

interface ProfileNodeCardProps {
  profile: Profile;
}

export function ProfileNodeCard({ profile }: ProfileNodeCardProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = copy[locale];
  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: theme === "dark" ? "rgba(11, 17, 32, 0.85)" : "rgba(255, 255, 255, 0.95)",
        borderColor: theme === "dark" ? "rgba(34, 211, 238, 0.20)" : "rgba(15, 23, 42, 0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, #0078D4, #22D3EE)",
        }}
        aria-hidden="true"
      />

      <div className="p-6">
        {/* Node label */}
        <p className="mono-label mb-5 text-[10px]">
          {locale === "es" ? "NODO DE PERFIL" : "PROFILE NODE"}
        </p>

        {/* Photo */}
        <div className="relative mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-400/30">
          <div
            className="absolute inset-0 z-0 flex items-center justify-center text-2xl font-bold text-cyan-300"
            style={{ background: theme === "dark" ? "rgba(34, 211, 238, 0.08)" : "rgba(0, 120, 212, 0.06)" }}
            aria-label={profile.profileImage.alt}
          >
            {profile.profileImage.placeholder}
          </div>
          <Image
            src={profile.profileImage.src}
            alt={profile.profileImage.alt}
            fill
            sizes="96px"
            className="z-10 object-cover"
            onError={() => {}}
            priority
          />
        </div>

        {/* Name & role */}
        <div className="text-center mb-5">
          <h2 className="text-base font-semibold text-slate-100 leading-snug">
            {profile.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{profile.currentRole}</p>
          <p className="text-xs text-slate-500 mt-0.5">{profile.currentCompany}</p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <MapPin size={12} className="text-slate-500" aria-hidden="true" />
          <span className="text-xs text-slate-500">{profile.location}</span>
        </div>

        {/* Divider */}
        <div
          className="mb-5 h-px"
          style={{ background: "rgba(148, 163, 184, 0.12)" }}
          aria-hidden="true"
        />

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-green-400" aria-hidden="true" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            {locale === "es" ? "Estado" : "Status"}
          </span>
          </div>
          <StatusBadge
            label={profile.status.label}
            variant={profile.status.variant}
          />
        </div>

        {/* Focus areas */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-3">
            {locale === "es" ? "Enfoque verificado" : "Verified Focus"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.focusAreas.map((area) => (
              <span
                key={area}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700/60 text-slate-500"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
