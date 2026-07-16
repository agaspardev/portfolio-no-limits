"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            ? "border-b backdrop-blur-xl"
            : "bg-transparent",
        )}
        style={{
          borderColor: isScrolled ? "var(--border-subtle)" : "transparent",
          background: isScrolled ? "var(--glass-bg)" : "transparent",
        }}
        role="banner"
      >
        <div className="section-container flex h-full items-center justify-between">
          {/* Logo */}
          <a
            href="#command-center"
            className="font-mono text-sm font-medium tracking-[0.18em] transition-colors"
            style={{ color: "var(--text-primary)" }}
            aria-label={locale === "es" ? "NO LIMITS — ir al inicio" : "NO LIMITS — go to the top"}
          >
            NO LIMITS
          </a>

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
                    "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md",
                  )}
                  style={{
                    color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full"
                      style={{
                        background: "var(--accent-cyan)",
                        boxShadow: "0 0 8px var(--accent-cyan)",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-control flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
              aria-label={theme === "dark" ? (locale === "es" ? "Cambiar a tema claro" : "Switch to light theme") : (locale === "es" ? "Cambiar a tema oscuro" : "Switch to dark theme")}
            >
              {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>

            <div
              className="flex items-center rounded-full border p-1"
              style={{
                borderColor: "var(--border-subtle)",
                background: "var(--glass-bg)",
              }}
            >
              <button
                type="button"
                onClick={() => setLocale("es")}
                className="px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors"
                style={{
                  color: locale === "es" ? "var(--accent-cyan)" : "var(--text-muted)",
                  background: locale === "es" ? "rgba(0, 120, 212, 0.10)" : "transparent",
                }}
                aria-pressed={locale === "es"}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className="px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors"
                style={{
                  color: locale === "en" ? "var(--accent-cyan)" : "var(--text-muted)",
                  background: locale === "en" ? "rgba(0, 120, 212, 0.10)" : "transparent",
                }}
                aria-pressed={locale === "en"}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="theme-control lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border transition-colors"
              aria-label={t.openMenu}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

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
