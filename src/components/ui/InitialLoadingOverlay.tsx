"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

type Phase = "hidden" | "error" | "glitch" | "fade";

export function InitialLoadingOverlay() {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [errorWords, setErrorWords] = useState<string[]>([]);
  const [glitchText, setGlitchText] = useState("SYSTEM DISCONNECTING...");

  const stateLines = useMemo(
    () =>
      locale === "es"
        ? ["Inicializando portafolio", "Cargando control center", "Preparando experiencia"]
        : ["Initializing portfolio", "Loading control center", "Preparing experience"],
    [locale],
  );

  useEffect(() => {
    const navType = window.performance.getEntriesByType("navigation")[0]?.type;
    const shouldShow = navType === "reload" || !window.sessionStorage.getItem("no-limits-intro-seen");
    if (!shouldShow) return;

    window.sessionStorage.setItem("no-limits-intro-seen", "1");
    setPhase("error");

    const phrase = "ERROR 404: Conventional developer not found.";
    const words = phrase.split(" ");
    let wordIndex = 0;

    const errorTimer = window.setInterval(() => {
      wordIndex += 1;
      setErrorWords(words.slice(0, wordIndex));

      if (wordIndex >= words.length) {
        window.clearInterval(errorTimer);
        window.setTimeout(() => setPhase("glitch"), 450);
      }
    }, 560);

    return () => window.clearInterval(errorTimer);
  }, []);

  useEffect(() => {
    if (phase !== "glitch") return;

    const glitchMessages = [
      "SYSTEM DISCONNECTING...",
      "RENDER LINK LOST",
      "CONTROL SIGNAL FAILED",
      "RECOVERING...",
    ];
    let index = 0;
    setGlitchText(glitchMessages[0]);

    const timer = window.setInterval(() => {
      index += 1;
      if (index < glitchMessages.length) {
        setGlitchText(glitchMessages[index]);
      } else {
        window.clearInterval(timer);
        window.setTimeout(() => setPhase("fade"), 420);
      }
    }, 420);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fade") return;

    const timer = window.setTimeout(() => setPhase("hidden"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "fade" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(180deg, rgba(0,0,0,1), rgba(2,6,23,1))"
                : "linear-gradient(180deg, rgba(255,255,255,1), rgba(241,245,249,1))",
          }}
          aria-label="Loading intro"
        >
          <div className="flex h-full w-full items-center justify-center px-6 text-center">
            {phase === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45 }}
                className="max-w-5xl font-mono text-[clamp(1.8rem,4vw,4.3rem)] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[clamp(2.2rem,4.4vw,4.8rem)]"
                style={{ color: "rgb(248,250,252)" }}
              >
                <span className="text-red-400">ERROR 404:</span>{" "}
                <span className="text-slate-100">
                  {errorWords.slice(2).join(" ")}
                </span>
                <span className="inline-block w-2 animate-pulse text-cyan-300">▍</span>
              </motion.p>
            )}

            {phase === "glitch" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <motion.p
                  animate={{
                    x: [0, -2, 2, -1, 1, 0],
                    opacity: [1, 0.82, 1, 0.88, 1],
                  }}
                  transition={{ duration: 0.32, repeat: 4, repeatType: "loop" }}
                  className="font-mono text-[clamp(1.2rem,2.6vw,2.2rem)] font-semibold uppercase tracking-[0.35em]"
                  style={{ color: "rgb(248,250,252)" }}
                >
                  {glitchText}
                </motion.p>
                <div
                  className="absolute inset-x-0 top-1/2 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(34,211,238,0.9), transparent)",
                    boxShadow: "0 0 18px rgba(34,211,238,0.35)",
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            )}

            {/* states phase removed on request */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
