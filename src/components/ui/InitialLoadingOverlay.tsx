"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  INTRO_COPY,
  INTRO_SESSION_KEY,
  INTRO_TIMING,
  shouldShowIntro,
} from "@/lib/intro-sequence";

type Phase = "hidden" | "statement" | "resolved" | "exit";

export function InitialLoadingOverlay() {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("hidden");
  const timersRef = useRef<number[]>([]);
  const copy = INTRO_COPY[locale];

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    setPhase((current) => (current === "hidden" ? "hidden" : "exit"));
  }, [clearTimers]);

  useEffect(() => {
    const seen = window.sessionStorage.getItem(INTRO_SESSION_KEY);
    const navigationEntry = window.performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!shouldShowIntro(seen, reducedMotion, isReload)) return;

    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");

    timersRef.current = [
      window.setTimeout(() => setPhase("statement"), 0),
      window.setTimeout(() => setPhase("resolved"), INTRO_TIMING.resolve),
      window.setTimeout(() => setPhase("exit"), INTRO_TIMING.exit),
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimers();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearTimers, dismiss]);

  useEffect(() => {
    if (phase !== "exit") return;

    const timer = window.setTimeout(
      () => setPhase("hidden"),
      INTRO_TIMING.exitDuration,
    );

    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          key="initial-intro"
          initial={{ y: 0 }}
          animate={{ y: phase === "exit" ? "-100%" : 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: INTRO_TIMING.exitDuration / 1000,
            ease: [0.76, 0, 0.24, 1],
          }}
          className={`intro-overlay ${phase === "exit" ? "pointer-events-none" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={copy.ariaLabel}
        >
          <div className="intro-grid" aria-hidden="true" />

          <header className="intro-header" aria-hidden="true">
            <span>NO LIMITS / 00</span>
            <span>{copy.systemLabel}</span>
          </header>

          <button type="button" className="intro-skip" onClick={dismiss}>
            {copy.skip} <span aria-hidden="true">[ESC]</span>
          </button>

          <div className="intro-stage">
            <AnimatePresence mode="wait">
              {phase === "statement" ? (
                <motion.div
                  key="statement"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="intro-message"
                >
                  <p className="intro-code">ERROR 404</p>
                  <p className="intro-title">
                    Conventional developer
                    <span>not found.</span>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="intro-message"
                >
                  <p className="intro-resolved">{copy.resolved}</p>
                  <p className="intro-title intro-title--online">
                    Antonio Gaspar
                    <span>{copy.online}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="intro-progress" aria-hidden="true">
            <div className="intro-progress__meta">
              <span>{copy.match}</span>
              <span>{phase === "statement" ? "404" : "200"}</span>
            </div>
            <div className="intro-progress__track">
              <motion.div
                className="intro-progress__value"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: INTRO_TIMING.exit / 1000, ease: "linear" }}
              />
            </div>
          </div>

          <motion.div
            className="intro-cut-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
