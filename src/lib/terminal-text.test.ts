import { describe, expect, it } from "vitest";
import { normalizeTerminalText } from "./terminal-text";

describe("normalizeTerminalText", () => {
  it("removes basic Markdown while preserving readable text", () => {
    expect(normalizeTerminalText("## Perfil\n**Python** y `Angular`; *cloud*."))
      .toBe("Perfil\nPython y Angular; cloud.");
  });

  it("converts list markers and limits consecutive blank lines", () => {
    expect(normalizeTerminalText("- Uno\n* Dos\n\n\n\nTres"))
      .toBe("• Uno\n• Dos\n\nTres");
  });

  it("handles incomplete streamed bold markers", () => {
    expect(normalizeTerminalText("Tiene experiencia con **Pyth"))
      .toBe("Tiene experiencia con Pyth");
  });

  it("collapses an exact consecutive sentence duplicated by a stream", () => {
    const sentence = "Antonio tiene 2 credenciales clasificadas en DevOps dentro del portfolio.";
    expect(normalizeTerminalText(`${sentence}${sentence}`)).toBe(sentence);
    expect(normalizeTerminalText(`${sentence} ${sentence}`)).toBe(sentence);
  });

  it("preserves repeated words and non-consecutive legitimate sentences", () => {
    expect(normalizeTerminalText("Muy bien, bien. Otra idea. Muy bien, bien."))
      .toBe("Muy bien, bien. Otra idea. Muy bien, bien.");
  });
});
