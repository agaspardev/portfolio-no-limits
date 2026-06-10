"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { copy } from "@/data/copy";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/portfolio";

interface MobileMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  navigation: NavItem[];
  activeSection: string;
  locale: "es" | "en";
}

export function MobileMenu({
  id,
  isOpen,
  onClose,
  navigation,
  activeSection,
  locale,
}: MobileMenuProps) {
  const t = copy[locale].ui;
  const { theme } = useTheme();
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{
              background: theme === "dark" ? "rgba(2, 6, 23, 0.70)" : "rgba(248, 250, 252, 0.72)",
            }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            id={id}
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] flex flex-col"
            style={{
              background: theme === "dark" ? "rgba(11, 17, 32, 0.98)" : "rgba(248, 250, 252, 0.98)",
              borderLeft: theme === "dark" ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid rgba(15, 23, 42, 0.10)",
              backdropFilter: "blur(20px)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t.mobileNavigation}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{
                borderColor: theme === "dark" ? "rgba(30, 41, 59, 0.60)" : "rgba(15, 23, 42, 0.10)",
              }}
            >
              <span
                className="font-mono text-sm tracking-[0.18em]"
                style={{ color: theme === "dark" ? "rgb(248, 250, 252)" : "rgb(15, 23, 42)" }}
              >
                NO LIMITS
              </span>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors"
                style={{
                  borderColor: theme === "dark" ? "rgba(51, 65, 85, 0.60)" : "rgba(15, 23, 42, 0.12)",
                  color: theme === "dark" ? "rgb(203, 213, 225)" : "rgb(71, 85, 105)",
                }}
                aria-label={t.closeMenu}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-5 space-y-1" aria-label={t.mobileNavigation}>
              {navigation.filter((item) => item.visible !== false).map((item, index) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                const label = locale === "es" ? item.labelEs : item.labelEn;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "text-cyan-300 bg-cyan-400/8 border border-cyan-400/20"
                        : theme === "dark"
                          ? "text-slate-300 hover:text-slate-50 hover:bg-slate-800/50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </motion.a>
                );
              })}
            </nav>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
