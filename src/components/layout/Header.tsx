"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/portfolio";

interface HeaderProps {
  navigation: NavItem[];
}

export function Header({ navigation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const t = copy[locale].ui;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection observer for active section highlight
  useEffect(() => {
    const sections = navigation.map((n) => n.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [navigation]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300",
          isScrolled
            ? theme === "dark"
              ? "border-b border-slate-800/60 bg-[rgba(2,6,23,0.88)] backdrop-blur-[20px]"
              : "border-b border-slate-200/80 bg-[rgba(248,250,252,0.96)] backdrop-blur-[20px]"
            : "bg-transparent",
        )}
        role="banner"
      >
        <div className="section-container flex h-full items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-sm font-medium tracking-[0.18em] text-slate-50 hover:text-cyan-300 transition-colors focus-visible:outline-cyan-400"
            aria-label="NO LIMITS — ir al inicio"
          >
            NO LIMITS
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label={t.navigation}
            className="hidden lg:flex items-center gap-1"
          >
            {navigation.filter((item) => item.visible !== false).map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              const label = locale === "es" ? item.labelEs : item.labelEn;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "text-cyan-300"
                      : theme === "dark"
                        ? "text-slate-400 hover:text-slate-100"
                        : "text-slate-500 hover:text-slate-900",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "theme-control flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                theme === "dark"
                  ? "border-slate-700/50 bg-slate-950/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40"
                  : "border-slate-200/80 bg-white/90 text-slate-700 hover:text-cyan-600 hover:border-cyan-400/50",
              )}
              aria-label={theme === "dark" ? (locale === "es" ? "Cambiar a tema claro" : "Switch to light theme") : (locale === "es" ? "Cambiar a tema oscuro" : "Switch to dark theme")}
              title={theme === "dark" ? (locale === "es" ? "Tema claro" : "Light theme") : (locale === "es" ? "Tema oscuro" : "Dark theme")}
            >
              {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>

            <div className={cn("flex items-center rounded-full border p-1", theme === "dark" ? "border-slate-700/50 bg-slate-950/60" : "border-slate-200/80 bg-white/90")}>
              <button
                type="button"
                onClick={() => setLocale("es")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors",
                  locale === "es"
                    ? "bg-cyan-400/15 text-cyan-300"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900",
                )}
                aria-pressed={locale === "es"}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors",
                  locale === "en"
                    ? "bg-cyan-400/15 text-cyan-300"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900",
                )}
                aria-pressed={locale === "en"}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsMobileOpen(true)}
              className={cn(
                "theme-control lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border transition-colors",
                theme === "dark"
                  ? "border-slate-700/50 text-slate-300 hover:text-slate-50 hover:border-cyan-400/40"
                  : "border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-cyan-400/40",
              )}
              aria-label={t.openMenu}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        id="mobile-menu"
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navigation={navigation}
        activeSection={activeSection}
        locale={locale}
      />
    </>
  );
}
