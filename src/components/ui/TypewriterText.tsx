"use client";

import { useEffect, useMemo, useState } from "react";

interface TypewriterTextProps {
  phrases: readonly string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
  cursorClassName?: string;
}

export function TypewriterText({
  phrases,
  typingSpeed = 42,
  deletingSpeed = 22,
  pauseMs = 1400,
  className,
  cursorClassName,
}: TypewriterTextProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const safePhrases = useMemo(() => phrases.filter(Boolean), [phrases]);
  const currentPhrase = safePhrases[phraseIndex] ?? "";

  useEffect(() => {
    if (!safePhrases.length) return;

    const timeout = window.setTimeout(
      () => {
        if (!deleting) {
          if (charIndex < currentPhrase.length) {
            const nextIndex = charIndex + 1;
            setDisplayText(currentPhrase.slice(0, nextIndex));
            setCharIndex(nextIndex);
          } else {
            window.setTimeout(() => setDeleting(true), pauseMs);
          }
        } else if (charIndex > 0) {
          const nextIndex = charIndex - 1;
          setDisplayText(currentPhrase.slice(0, nextIndex));
          setCharIndex(nextIndex);
        } else {
          setDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % safePhrases.length);
        }
      },
      deleting ? deletingSpeed : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [charIndex, currentPhrase, deleting, deletingSpeed, pauseMs, safePhrases.length, typingSpeed]);

  useEffect(() => {
    if (safePhrases.length) {
      setDisplayText(safePhrases[0].slice(0, 1));
      setCharIndex(1);
    }
  }, [safePhrases]);

  if (!safePhrases.length) return null;

  return (
    <span className={className}>
      <span>{displayText}</span>
      <span
        className={cursorClassName ?? "ml-1 inline-block align-middle"}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
