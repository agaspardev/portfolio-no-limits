"use client";

import Script from "next/script";
import { useTheme } from "@/components/providers/ThemeProvider";

export function LinkedInProfileBadge() {
  const { theme } = useTheme();

  return (
    <>
      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        strategy="afterInteractive"
      />
      <div className="flex justify-center">
        <div
          key={theme}
          className="badge-base LI-profile-badge"
          data-locale="es_ES"
          data-size="medium"
          data-theme={theme}
          data-type="HORIZONTAL"
          data-vanity="antoniogasparr"
          data-version="v1"
        >
          <a
            className="badge-base__link LI-simple-link"
            href="https://cl.linkedin.com/in/antoniogasparr?trk=profile-badge"
          />
        </div>
      </div>
    </>
  );
}
