"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { copy } from "@/data/copy";

export function BackToTopButton() {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const t = copy[locale].ui;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors"
          style={{
            background: theme === "dark" ? "rgba(2, 6, 23, 0.90)" : "rgba(255, 255, 255, 0.94)",
            borderColor: theme === "dark" ? "rgba(51, 65, 85, 0.85)" : "rgba(15, 23, 42, 0.12)",
            color: theme === "dark" ? "rgb(226, 232, 240)" : "rgb(15, 23, 42)",
            boxShadow: theme === "dark" ? "0 18px 40px rgba(0, 0, 0, 0.30)" : "0 18px 40px rgba(15, 23, 42, 0.12)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme === "dark" ? "rgba(34, 211, 238, 0.40)" : "rgba(0, 120, 212, 0.24)";
            e.currentTarget.style.color = theme === "dark" ? "rgb(103, 232, 249)" : "rgb(0, 120, 212)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme === "dark" ? "rgba(51, 65, 85, 0.85)" : "rgba(15, 23, 42, 0.12)";
            e.currentTarget.style.color = theme === "dark" ? "rgb(226, 232, 240)" : "rgb(15, 23, 42)";
          }}
          aria-label={locale === "es" ? "Volver al inicio" : "Back to top"}
          title={locale === "es" ? "Volver al inicio" : "Back to top"}
        >
          <ArrowUp size={18} aria-hidden="true" />
          <span className="sr-only">{locale === "es" ? "Volver al inicio" : "Back to top"}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
