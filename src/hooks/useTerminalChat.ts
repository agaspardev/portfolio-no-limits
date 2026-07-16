"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface TerminalMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Encapsulates the chat logic for the hero terminal.
 * Migrated from ChatPanel.tsx — sessionId is unique per visitor,
 * input is sent to /api/chat, and responses are streamed back.
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

    const userMessage: TerminalMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId: sessionIdRef.current,
          locale,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to get response");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
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
    } catch {
      // Keep transport errors localized in the UI without exposing backend details.
      setMessages((prev) => {
        if (prev.at(-1)?.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { role: "assistant", content: "__ERROR__" },
          ];
        }
        return [...prev, { role: "assistant", content: "__ERROR__" }];
      });
    } finally {
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
