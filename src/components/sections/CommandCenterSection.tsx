"use client";

import { useRef, useEffect, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { FileDown, ChevronDown, Send, CheckCircle2 } from "lucide-react";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTerminalChat } from "@/hooks/useTerminalChat";
import { normalizeTerminalText } from "@/lib/terminal-text";
import { copy } from "@/data/copy";
import { staggerContainer, fadeUp, slideInRight } from "@/lib/animations";
import type { Profile, CVData } from "@/types/portfolio";

interface CommandCenterSectionProps {
  profile: Profile;
  cv: CVData;
}

/** Interactive terminal block: static profile info + live chat with the assistant. */
function TerminalBlock({ role }: { role: string }) {
  const { locale } = useLocale();
  const t = copy[locale].hero.terminal;
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    handleKeyDown,
  } = useTerminalChat(locale);

  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreInputFocusRef = useRef(false);

  // Scroll only the terminal history; never move or grow the page container.
  useEffect(() => {
    const history = historyRef.current;
    if (!history) return;

    if (messages.length === 0 && !isLoading) {
      history.scrollTop = 0;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      history.scrollTop = history.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, isLoading]);

  const canSend = input.trim().length > 0 && !isLoading;

  // Restore focus only after an explicit submission; never autofocus on load.
  useEffect(() => {
    if (isLoading || !restoreInputFocusRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
      restoreInputFocusRef.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  const handleTerminalKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey && canSend) {
      restoreInputFocusRef.current = true;
    }
    handleKeyDown(event);
  };

  const handleSendClick = () => {
    if (!canSend) return;
    restoreInputFocusRef.current = true;
    inputRef.current?.focus({ preventScroll: true });
    void sendMessage();
  };

  return (
    <motion.div
      variants={slideInRight}
      className="terminal-window"
    >
      {/* Title bar with traffic lights */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
          <div className="h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
          <div className="h-3 w-3 rounded-full" style={{ background: "#22c55e" }} />
        </div>
        <span className="flex-1 text-center text-xs font-mono" style={{ color: "var(--terminal-text-dim)" }}>
          {t.headerTitle}
        </span>
        <div className="w-12" />
      </div>

      <div className="terminal-body">
        <div
          ref={historyRef}
          className="terminal-history"
        >
          {/* ── Static decorative blocks ── */}

        <div className="mb-2">
          <span className="terminal-prompt">$</span>{" "}
          <span className="terminal-command">whoami</span>
        </div>
        <div className="mb-3" style={{ color: "var(--terminal-text)" }}>
          <div>Antonio Gaspar</div>
          <div>{role}</div>
          <div>Innobyte S.A. | Chile</div>
        </div>

        <div className="mb-2">
          <span className="terminal-prompt">$</span>{" "}
          <span className="terminal-command">cat /etc/focus.conf</span>
        </div>
        <div className="mb-3">
          <div>
            <span style={{ color: "var(--terminal-command)" }}>{t.domains.cloud}</span>
            <span style={{ color: "var(--terminal-text-dim)" }}> .............. </span>
            Azure, AWS, GCP
          </div>
          <div>
            <span style={{ color: "var(--terminal-command)" }}>{t.domains.devops}</span>
            <span style={{ color: "var(--terminal-text-dim)" }}> ............. </span>
            CI/CD, GitHub Workflows
          </div>
          <div>
            <span style={{ color: "var(--terminal-command)" }}>{t.domains.ai}</span>
            <span style={{ color: "var(--terminal-text-dim)" }}> .................... </span>
            Applied AI, Automation
          </div>
          <div>
            <span style={{ color: "var(--terminal-command)" }}>{t.domains.security}</span>
            <span style={{ color: "var(--terminal-text-dim)" }}> ........... </span>
            Vulnerability Analysis
          </div>
        </div>

        <div className="mb-2">
          <span className="terminal-prompt">$</span>{" "}
          <span className="terminal-command">cat /etc/status.json</span>
        </div>
        <div>
          <pre className="max-w-full whitespace-pre-wrap break-words text-xs leading-relaxed" style={{ color: "var(--terminal-text)" }}>{`{
  "status": "${t.status.status}",
  "mode": "${t.status.mode}",
  "${t.status.stack}": "Angular · .NET · Node.js · Python"
}`}</pre>
        </div>

        {/* ── Live chat section ── */}

          <div className="terminal-divider">{t.chatDivider}</div>

          <div
            role="log"
            aria-live="polite"
            aria-atomic="false"
            aria-busy={isLoading}
          >
            {messages.map((msg, i) => {
              const isError = msg.role === "assistant" && msg.content === "__ERROR__";
              const display = isError
                ? t.error
                : msg.role === "assistant"
                  ? normalizeTerminalText(msg.content)
                  : msg.content;
              return (
                <div key={i} className="terminal-chat-line">
                  <span className="terminal-prompt">
                    {msg.role === "user" ? "$" : ">"}
                  </span>{" "}
                  <span
                    className={
                      msg.role === "user"
                        ? "terminal-chat-user"
                        : "terminal-chat-assistant"
                    }
                    style={isError ? { color: "var(--status-red)" } : undefined}
                  >
                    {display}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="terminal-chat-line" aria-label={t.thinking}>
                <span className="terminal-prompt">&gt;</span>{" "}
                <span style={{ color: "var(--terminal-text-dim)" }}>
                  <span
                    className="animate-spin inline-block w-3 h-3 border-2 align-middle mr-1"
                    style={{
                      borderColor: "var(--terminal-divider)",
                      borderTopColor: "var(--terminal-assistant-accent)",
                      borderRadius: "9999px",
                    }}
                    aria-hidden="true"
                  />
                  {t.thinking}
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Active input — replaces the old static cursor */}
        <div className="terminal-input-row">
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTerminalKeyDown}
            placeholder={t.inputPlaceholder}
            readOnly={isLoading}
            aria-disabled={isLoading}
            className="terminal-input"
            aria-label={t.inputAria}
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleSendClick}
            disabled={!canSend}
            className="terminal-send-btn"
            aria-label={t.sendAria}
          >
            <Send size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PillarItem({ label }: { label: string }) {
  return (
    <motion.span
      variants={fadeUp}
      className="inline-flex items-center gap-2 font-mono text-xs"
      style={{ color: "var(--text-muted)" }}
    >
      <CheckCircle2 size={14} style={{ color: "var(--accent-green)" }} />
      <span style={{ color: "var(--accent-cyan)" }}>[</span>
      {label}
      <span style={{ color: "var(--accent-cyan)" }}>]</span>
    </motion.span>
  );
}

export function CommandCenterSection({ profile, cv }: CommandCenterSectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].hero;

  const pillars = [
    { label: "Cloud Ready", icon: "Cloud" },
    { label: "DevOps Mindset", icon: "Zap" },
    { label: "Secure by Design", icon: "Shield" },
    { label: "Full-Stack Engineering", icon: "Code" },
    { label: "Automation Focus", icon: "Cpu" },
  ];

  return (
    <section
      id="command-center"
      className="relative min-h-[calc(100vh-72px)] flex items-center py-20 md:py-24"
      aria-label="Command Center"
    >
      {/* Background atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 800px 500px at 15% 25%, rgba(6, 182, 212, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 600px 400px at 85% 75%, rgba(59, 130, 246, 0.05) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Grid dots background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow — terminal style */}
            <motion.div
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[11px]"
              style={{
                background: "rgba(6, 182, 212, 0.06)",
                border: "1px solid rgba(6, 182, 212, 0.12)",
                color: "var(--accent-cyan)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--accent-green)" }} />
              <span className="uppercase tracking-[0.2em]">{t.eyebrow}</span>
            </motion.div>

            {/* Name — large, impactful */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-4 tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {profile.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="gradient-text">
                {profile.name.split(" ").slice(-1).join(" ")}
              </span>
            </motion.h1>

            {/* Role — monospace terminal style */}
            <motion.div variants={fadeUp} className="mb-2">
              <p
                className="text-lg md:text-xl font-mono flex items-center gap-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <span style={{ color: "var(--accent-cyan)" }}>&gt;</span>
                <TypewriterText
                  phrases={t.typedPhrases}
                  className="inline-flex items-center"
                  cursorClassName="ml-1 inline-block"
                />
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.div variants={fadeUp} className="mb-5">
              <p className="text-base" style={{ color: "var(--text-secondary)" }}>{t.tagline}</p>
              <p className="text-sm mt-1 font-mono" style={{ color: "var(--text-disabled)" }}>{t.taglineSub}</p>
            </motion.div>

            {/* Summary — styled as terminal output */}
            <motion.div
              variants={fadeUp}
              className="mb-8 pl-4 border-l-2"
              style={{ borderColor: "rgba(6, 182, 212, 0.20)" }}
            >
              <p className="text-sm leading-relaxed font-mono" style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--accent-cyan)" }}>#</span> {t.summary}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="#contact"
                className="btn-primary justify-center sm:justify-start"
                aria-label={t.aria.ctaPrimary}
              >
                <Send size={16} />
                {t.ctaPrimary}
              </a>
              <a href="#projects" className="btn-secondary justify-center sm:justify-start">
                <ChevronDown size={16} />
                {t.ctaSecondary}
              </a>
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary justify-center sm:justify-start"
                aria-label={t.aria.ctaTertiary}
              >
                <FileDown size={16} />
                {t.ctaTertiary}
              </a>
            </motion.div>

            {/* Pillars — terminal style checklist */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {pillars.map((p) => (
                <PillarItem key={p.label} label={p.label} />
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — Terminal (now the live chat) */}
          <TerminalBlock
            role={locale === "es" ? profile.currentRoleEs : profile.currentRoleEn}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="hidden md:flex justify-center mt-16"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
            style={{ color: "var(--text-disabled)" }}
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">{t.scroll}</span>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
