"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { isTerminalClearCommand } from "@/lib/terminal-text";
import { isTerminalCommand, executeTerminalCommand } from "@/lib/terminal-commands";
import {
  ChatHttpError,
  classifyChatFailure,
  getChatFailureMessage,
} from "@/lib/chat-errors";

export interface TerminalMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_TIMEOUT_MS = 15_000;

/**
 * Encapsulates the chat logic for the hero terminal.
 * Handles: clear command, terminal commands (ls, cat, whoami, etc.),
 * deterministic AI responses, and streaming from Groq.
 *
 * UI-agnostic: the consuming component decides how to render messages.
 */
export function useTerminalChat(locale: "es" | "en") {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Stable, unique session id per visitor (generated once, client-side).
  const sessionIdRef = useRef<string>("");
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    // 1. Clear command — local only, no API call
    if (isTerminalClearCommand(input)) {
      setMessages([]);
      setInput("");
      return;
    }

    const userMessage: TerminalMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // 2. Terminal commands — local only, no API call
    if (isTerminalCommand(input)) {
      const result = executeTerminalCommand(input, locale, [...messages, userMessage]);
      if (result) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.output }]);
      }
      return;
    }

    // 3. AI chat — send to API
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId: sessionIdRef.current,
          locale,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new ChatHttpError(res.status);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new ChatHttpError(502);
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value);
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            last.content = assistantMessage;
          }
          return next;
        });
      }
    } catch (error) {
      const errorMsg = getChatFailureMessage(classifyChatFailure(error), locale);
      setMessages((prev) => {
        if (prev.at(-1)?.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { role: "assistant", content: errorMsg },
          ];
        }
        return [...prev, { role: "assistant", content: errorMsg }];
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [input, isLoading, locale, messages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    handleKeyDown,
  };
}
