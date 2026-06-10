"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "es" | "en";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, defaultLocale = "es" }: { children: React.ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "es" || saved === "en") setLocale(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
