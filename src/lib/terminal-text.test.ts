import { describe, expect, it } from "vitest";
import {
  isTerminalClearCommand,
  normalizeTerminalText,
  parseTerminalLinks,
} from "./terminal-text";

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

describe("isTerminalClearCommand", () => {
  it.each(["clear", " CLEAR ", "cls", "limpiar", "$ clear", "> clear", "  $  clear  "])(
    "recognizes the local terminal command %s",
    (command) => expect(isTerminalClearCommand(command)).toBe(true),
  );

  it.each(["clear profile", "aclara", "limpiar experiencia", "cle", "clrs"])(
    "does not intercept a conversational message: %s",
    (message) => expect(isTerminalClearCommand(message)).toBe(false),
  );
});

describe("parseTerminalLinks", () => {
  it("turns canonical absolute and abbreviated URLs into safe href values", () => {
    expect(parseTerminalLinks(
      "LinkedIn: https://www.linkedin.com/in/antoniogasparr Credly: credly.com/users/antonio",
    )).toEqual([
      { text: "LinkedIn: " },
      {
        text: "https://www.linkedin.com/in/antoniogasparr",
        href: "https://www.linkedin.com/in/antoniogasparr",
      },
      { text: " Credly: " },
      {
        text: "credly.com/users/antonio",
        href: "https://credly.com/users/antonio",
      },
    ]);
  });

  it("preserves plain text without inventing a link", () => {
    expect(parseTerminalLinks("Sin enlaces")).toEqual([{ text: "Sin enlaces" }]);
  });
});
