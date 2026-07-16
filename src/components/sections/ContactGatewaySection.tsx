"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconResolver } from "@/components/ui/IconResolver";
import { useLocale } from "@/components/providers/LocaleProvider";
import { copy } from "@/data/copy";
import { fadeUp, slideInRight, viewportOnce } from "@/lib/animations";
import type { SocialLink } from "@/types/portfolio";

interface ContactGatewaySectionProps {
  socialLinks: SocialLink[];
}

export function ContactGatewaySection({ socialLinks }: ContactGatewaySectionProps) {
  const { locale } = useLocale();
  const t = copy[locale].sections.contact;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — hidden from real users
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const channels = socialLinks.filter((link) => link.url);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFeedback({ type: "error", text: t.feedback.fillAll });
      return;
    }
    if (trimmedName.length < 2) {
      setFeedback({ type: "error", text: t.feedback.shortName });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFeedback({ type: "error", text: t.feedback.invalidEmail });
      return;
    }
    if (trimmedMessage.length < 10) {
      setFeedback({ type: "error", text: t.feedback.shortMessage });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, message: trimmedMessage, company }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFeedback({ type: "success", text: t.feedback.success });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setFeedback({ type: "error", text: data.error || t.feedback.genericError });
      }
    } catch {
      setFeedback({ type: "error", text: t.feedback.networkError });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2";
  const inputStyle = {
    background: "var(--glass-bg)",
    borderColor: "var(--border-subtle)",
    color: "var(--text-primary)",
  } as const;

  return (
    <SectionContainer id="contact">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          onSubmit={handleSubmit}
          noValidate
          aria-label={t.aria.form}
          className="surface-card flex flex-col gap-5 p-6 md:p-8"
        >
          <p className="mono-label text-[10px]" style={{ color: "var(--accent-cyan)" }}>
            {t.form}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                {t.name}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                {t.email}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex min-h-40 flex-1 flex-col">
            <label htmlFor="contact-message" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              {t.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className={`${inputClass} min-h-32 flex-1 resize-y`}
              style={inputStyle}
            />
          </div>

          {/* Honeypot — hidden from humans; only bots fill it */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {feedback && (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
              className="text-xs font-medium"
              style={{ color: feedback.type === "error" ? "#f87171" : "var(--accent-green)" }}
            >
              {feedback.text}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            aria-label={t.aria.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {t.button}
          </button>
        </motion.form>

        {/* Channels */}
        <motion.aside
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          aria-label={t.channels}
        >
          <p className="mono-label text-[10px] mb-4" style={{ color: "var(--accent-cyan)" }}>
            {t.channels}
          </p>
          <ul className="space-y-3">
            {channels.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="surface-card surface-card-hover flex items-center gap-4 p-4"
                  aria-label={`${locale === "es" ? link.labelEs : link.labelEn} — ${locale === "es" ? link.descriptionEs : link.descriptionEn}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg icon-chip" aria-hidden="true">
                    <IconResolver name={link.icon} size={16} className="icon-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {locale === "es" ? link.labelEs : link.labelEn}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {locale === "es" ? link.descriptionEs : link.descriptionEn}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </SectionContainer>
  );
}
