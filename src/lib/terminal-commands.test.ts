import { describe, expect, it } from "vitest";
import cv from "@/data/cv.json";
import projects from "@/data/projects.json";
import {
  executeTerminalCommand,
  isTerminalCommand,
} from "./terminal-commands";

describe("terminal command routing", () => {
  it.each(["help", "$ whoami", "cat profile", "perfil", "credentials", "echo hola"])(
    "recognizes %s locally",
    (command) => expect(isTerminalCommand(command)).toBe(true),
  );

  it.each(["clear", "¿Qué experiencia tiene?", "unknown"])(
    "does not claim unsupported command %s",
    (command) => expect(isTerminalCommand(command)).toBe(false),
  );

  it("derives portfolio counts from canonical JSON", () => {
    const output = executeTerminalCommand("ls", "es")!.output;
    const certificationCount = cv.certifications.flatMap((group) => group.items).length;
    expect(output).toContain(`Certificaciones (${certificationCount})`);
    expect(output).toContain(`Casos de trabajo (${projects.length})`);
  });

  it("renders the English profile with English copy", () => {
    const output = executeTerminalCommand("cat profile", "en")!.output;
    expect(output).toContain("A professional focused on solution development");
    expect(output).not.toContain("Profesional con foco");
  });

  it("derives contact URLs and email from social-links.json", () => {
    const output = executeTerminalCommand("contact", "es")!.output;
    expect(output).toContain("https://www.linkedin.com/in/antoniogasparr");
    expect(output).toContain("contacto@antoniogaspar.dev");
  });

  it("shows the supplied conversation history", () => {
    const output = executeTerminalCommand("history", "es", [
      { role: "user", content: "hola" },
      { role: "assistant", content: "¡Hola!" },
    ])!.output;
    expect(output).toContain("Historial (2 mensajes)");
    expect(output).toContain("$ hola");
  });
});
