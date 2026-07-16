import { describe, expect, it } from "vitest";
import {
  buildChatContext,
  createChatSystemPrompt,
  detectChatLocale,
  getDeterministicChatResponse,
  selectChatTopics,
} from "./chat-context";
import { certificationKnowledge, contactKnowledge } from "./chat-knowledge";

describe("chat context selection", () => {
  it("uses the minimal profile context for ambiguous help questions", () => {
    const result = buildChatContext("Hola, ¿cómo me puedes ayudar?");
    expect(result.topics).toEqual(["profile"]);
    expect(result.context).toContain("Antonio Gaspar");
    expect(result.context).not.toContain("Enterprise Energy Platform");
    expect(result.context).not.toContain("Microsoft Certified");
  });

  it("selects only documented Python experience", () => {
    const result = buildChatContext("¿Qué experiencia tiene Antonio con Python?");
    expect(result.topics).toEqual(["experience"]);
    expect(result.context).toContain("Python");
    expect(result.context).toContain("Integrador de Sistemas");
    expect(result.context).not.toContain("Desarrollador Full-Stack");
    expect(result.context).not.toContain("Enterprise Cloud Platform");
  });

  it("can combine explicitly requested topics", () => {
    expect(selectChatTopics("Dime sus proyectos y cómo contactarlo"))
      .toEqual(["projects", "contact"]);
  });

  it("preserves English for an English question", () => {
    const result = buildChatContext("What experience does Antonio have with Python?");
    expect(result.locale).toBe("en");
    expect(result.context).toContain("Systems Integrator");
  });

  it("enforces concise, non-redundant terminal answers", () => {
    const prompt = createChatSystemPrompt("¿Cómo me puedes ayudar?");
    expect(prompt).toContain("at most 2 sentences AND 45 words");
    expect(prompt).toContain("exactly 1 sentence, at most 25 words");
    expect(prompt).toContain("Never repeat the same fact");
  });

  it("uses positive grounded wording for Python", () => {
    const prompt = createChatSystemPrompt("¿Qué experiencia tiene con Python?");
    expect(prompt).toContain(
      "Python forma parte del stack de su rol actual como Integrador de Sistemas, donde participa en integración, automatización y mejora continua de aplicaciones web.",
    );
    expect(prompt).not.toContain("No hay detalle público de proyectos específicos con Python.");
    expect(prompt).toContain("do not claim backend, AWS, or specific Python projects");
  });

  it.each(["Hola", "¡Hola! 👋", "buenas", "Buenos días.", "Buenas tardes", "buenas noches 😊"])(
    "answers the Spanish pure greeting %s without invoking the model",
    (greeting) => {
      expect(getDeterministicChatResponse(greeting)).toBe(
        "¡Hola! Encantado de ayudarte. Puedes preguntarme por la experiencia, tecnologías, certificaciones o proyectos de Antonio.",
      );
    },
  );

  it.each(["Hello", "Hi!", "hey 👋"])(
    "answers the English pure greeting %s without invoking the model",
    (greeting) => {
      expect(getDeterministicChatResponse(greeting)).toBe(
        "Hi! Happy to help. You can ask me about Antonio's experience, technologies, certifications, or projects.",
      );
    },
  );

  it("uses explicit language signals before the UI locale and UI locale for ambiguous text", () => {
    expect(detectChatLocale("Hi", "es")).toBe("en");
    expect(detectChatLocale("Hola", "en")).toBe("es");
    expect(detectChatLocale("Python", "en")).toBe("en");
    expect(detectChatLocale("Python", "es")).toBe("es");
    expect(buildChatContext("Python", "en").context).toContain("Systems Integrator");
  });

  it("keeps an English substantive question in English when the UI is Spanish", () => {
    const response = getDeterministicChatResponse(
      "Hi, what experience does Antonio have?",
      "es",
    );
    expect(response).toContain("Antonio has worked as");
    expect(response).not.toContain("Integrador de Sistemas");
  });

  it.each([
    ["rust", "Rust no forma parte"],
    ["aws", "AWS es parte"],
    ["cv", "El CV de Antonio"],
    ["email", "contacto@antoniogaspar.dev"],
  ])("does not classify the valid domain input %s as gibberish", (question, expected) => {
    expect(getDeterministicChatResponse(question, "es")).toContain(expected);
  });

  it("keeps generic deterministic answers concise", () => {
    const response = getDeterministicChatResponse(
      "¿Qué experiencia profesional tiene Antonio?",
      "es",
    );
    expect(response).not.toBeNull();
    expect(response!.split(/\s+/).length).toBeLessThanOrEqual(50);
  });

  it("answers the verified Python FAQ consistently, with an optional greeting", () => {
    expect(getDeterministicChatResponse(
      "¿Qué experiencia tiene en Python?",
      "es",
    )).toBe(
      "Python forma parte del stack de su rol actual como Integrador de Sistemas, donde participa en integración, automatización y mejora continua de aplicaciones web.",
    );
    expect(getDeterministicChatResponse(
      "Hola, ¿qué experiencia tiene en Python?",
      "es",
    )).toBe(
      "¡Hola! Python forma parte del stack de su rol actual como Integrador de Sistemas, donde participa en integración, automatización y mejora continua de aplicaciones web.",
    );
    expect(getDeterministicChatResponse(
      "What experience does Antonio have with Python?",
      "en",
    )).toContain("Python is part of his current stack as a Systems Integrator");
    expect(createChatSystemPrompt("Hola, ¿qué experiencia tiene en Python?"))
      .toContain("briefly reciprocate and answer");
  });

  it("uses the UI locale for an ambiguous help request", () => {
    expect(getDeterministicChatResponse("What can you do?", "en")).toContain("Of course!");
    expect(getDeterministicChatResponse("¿Qué puedes hacer?", "es")).toContain("¡Claro!");
  });

  it.each([
    ["crea una función en Python que imprima hola mundo", "es", "Puedo contarte"],
    ["asísteme creando una función en Python", "es", "Puedo contarte"],
    ["write a Python function that prints hello world", "en", "I can tell you"],
    ["explain this SQL query", "en", "I can tell you"],
  ] as const)("rejects coding task before technology FAQs: %s", (question, locale, start) => {
    const response = getDeterministicChatResponse(question, locale);
    expect(response).toContain(start);
    expect(response).toMatch(/no genera código|does not generate code/);
    expect(response).not.toContain("``` ");
  });

  it("keeps the rejection coherent for a contextual follow-up", () => {
    const history = [
      { role: "user" as const, content: "crea una función en Python" },
      { role: "assistant" as const, content: "No genero código." },
      { role: "user" as const, content: "hazlo" },
    ];
    expect(getDeterministicChatResponse("hazlo", "es", history)).toContain(
      "este asistente no genera código",
    );
  });

  it.each(["cuánto es 2+2", "2 + 2", "calculate 8*7"])(
    "rejects math without calculating it: %s",
    (question) => {
      const response = getDeterministicChatResponse(question, "es");
      expect(response).toContain("perfil profesional de Antonio");
      expect(response).not.toMatch(/\b(4|56)\b/);
    },
  );

  it("redirects general knowledge without dumping Antonio's biography", () => {
    const response = getDeterministicChatResponse(
      "¿Qué día es la independencia de Chile?",
      "es",
    );
    expect(response).toBe(
      "Este asistente está enfocado en el perfil profesional de Antonio. Puedo ayudarte con su experiencia, tecnologías, certificaciones o proyectos.",
    );
    expect(response).not.toContain("Innobyte");
  });

  it("keeps professional follow-ups in scope", () => {
    const history = [
      { role: "user" as const, content: "Cuéntame sobre la experiencia de Antonio" },
      { role: "assistant" as const, content: "Antonio ha trabajado en integración." },
      { role: "user" as const, content: "cuéntame más" },
    ];
    expect(getDeterministicChatResponse("cuéntame más", "es", history)).toBeNull();
  });

  it("describes an unpublished technology neutrally", () => {
    expect(getDeterministicChatResponse("¿y en Rust?", "es")).toBe(
      "Rust no forma parte del stack profesional publicado de Antonio.",
    );
    expect(getDeterministicChatResponse("What about Rust?", "en")).toBe(
      "Rust is not part of Antonio's published professional stack.",
    );
  });

  it("keeps Python experience in scope despite coding enforcement", () => {
    expect(getDeterministicChatResponse(
      "¿Qué experiencia tiene con Python?",
      "es",
    )).toContain("Python forma parte del stack");
  });

  it("has a secondary model guardrail for excluded tasks", () => {
    const prompt = createChatSystemPrompt("cuéntame más", "es");
    expect(prompt).toContain("Never generate, explain, correct, or offer to produce code");
    expect(prompt).toContain("never solve calculations");
    expect(prompt).toContain("without adding a biography");
  });

  it("derives the credential total and every filter count from canonical CV data", () => {
    expect(certificationKnowledge).toEqual({
      total: 13,
      byFilter: {
        Cloud: 5,
        DevOps: 2,
        Agile: 2,
        AI: 3,
        Security: 2,
        Microsoft: 3,
        Work: 1,
        Data: 1,
        PM: 1,
      },
    });
  });

  it.each([
    ["¿Cuántas credenciales tiene Antonio?", "13 credenciales profesionales"],
    ["cuantas son de cloud?", "5 credenciales clasificadas en Cloud"],
    ["¿cuántas de IA?", "3 credenciales clasificadas en IA"],
    ["¿cuántas de DevOps?", "2 credenciales clasificadas en DevOps"],
    ["¿cuántas de Agile?", "2 credenciales clasificadas en Agile"],
    ["¿cuántas de seguridad?", "2 credenciales clasificadas en Seguridad"],
    ["¿cuántas de Microsoft?", "3 credenciales clasificadas en Microsoft"],
    ["¿cuántas de trabajo remoto?", "1 credencial clasificada en Trabajo remoto"],
    ["¿cuántas de Data?", "1 credencial clasificada en Data"],
    ["¿cuántas de gestión de proyectos?", "1 credencial clasificada en Gestión de proyectos"],
  ])("answers canonical credential count for %s", (question, expected) => {
    expect(getDeterministicChatResponse(question, "es")).toContain(expected);
    expect(selectChatTopics(question)).toEqual(["credentials"]);
  });

  it.each([
    ["How many credentials does Antonio have?", "13 professional credentials"],
    ["How many cloud certifications?", "5 credentials classified under Cloud"],
    ["How many AI credentials?", "3 credentials classified under AI"],
    ["How many project management certifications?", "1 credential classified under Project Management"],
  ])("answers credential counts in English for %s", (question, expected) => {
    expect(getDeterministicChatResponse(question, "en")).toContain(expected);
  });

  it("handles the exact typo and category follow-up conversation deterministically", () => {
    const first = "cuantes certificaciones tiene antonio ?";
    const second = "cuantas son cloud ?";
    const third = "y devops ¡";

    expect(getDeterministicChatResponse(first, "es")).toContain("13 credenciales");
    expect(getDeterministicChatResponse(second, "es", [
      { role: "user", content: first },
      { role: "assistant", content: "Antonio tiene 13 credenciales." },
      { role: "user", content: second },
    ])).toContain("5 credenciales clasificadas en Cloud");
    expect(getDeterministicChatResponse(third, "es", [
      { role: "assistant", content: "Antonio tiene 13 credenciales." },
      { role: "user", content: second },
      { role: "assistant", content: "Antonio tiene 5 credenciales clasificadas en Cloud." },
      { role: "user", content: third },
    ])).toBe("Antonio tiene 2 credenciales clasificadas en DevOps dentro del portfolio.");
  });

  it("inherits credential count intent for a terse English filter follow-up", () => {
    const history = [
      { role: "user" as const, content: "How many certifications does Antonio have?" },
      { role: "assistant" as const, content: "Antonio has 13 professional credentials." },
      { role: "user" as const, content: "and security?" },
    ];
    expect(getDeterministicChatResponse("and security?", "en", history)).toBe(
      "Antonio has 2 credentials classified under Security in the portfolio.",
    );
  });

  it("answers DevOps experience questions deterministically", () => {
    const history = [
      { role: "user" as const, content: "¿Cuántas certificaciones tiene?" },
      { role: "assistant" as const, content: "Antonio tiene 13 credenciales." },
      { role: "user" as const, content: "¿Qué experiencia tiene con DevOps?" },
    ];
    const response = getDeterministicChatResponse(
      "¿Qué experiencia tiene con DevOps?",
      "es",
      history,
    );
    expect(response).not.toBeNull();
    expect(response).toContain("DevOps");
  });

  it("derives the canonical contact email from social links", () => {
    expect(contactKnowledge.email).toBe("contacto@antoniogaspar.dev");
  });

  it.each([
    [
      "¿Cómo contacto a Antonio?",
      "es",
      "Puedes contactar a Antonio en contacto@antoniogaspar.dev o usar el formulario de la sección Contacto del portfolio.",
    ],
    [
      "¿Cómo puedo contactar a Antonio?",
      "es",
      "Puedes contactar a Antonio en contacto@antoniogaspar.dev o usar el formulario de la sección Contacto del portfolio.",
    ],
    [
      "How can I contact Antonio?",
      "en",
      "You can contact Antonio at contacto@antoniogaspar.dev or use the form in the portfolio's Contact section.",
    ],
  ] as const)("answers contact intent without Groq: %s", (question, locale, expected) => {
    expect(getDeterministicChatResponse(question, locale)).toBe(expected);
  });

  it.each([
    [
      "envíale un mensaje",
      "es",
      "Este chat todavía no envía mensajes. Puedes escribirle a contacto@antoniogaspar.dev o usar el formulario de la sección Contacto.",
    ],
    [
      "¿Puedes enviarle un mensaje por mí de forma automática?",
      "es",
      "Este chat todavía no envía mensajes. Puedes escribirle a contacto@antoniogaspar.dev o usar el formulario de la sección Contacto.",
    ],
    [
      "send him a message from here",
      "en",
      "This chat does not send messages yet. You can email Antonio at contacto@antoniogaspar.dev or use the Contact section form.",
    ],
  ] as const)("does not pretend to send a message: %s", (question, locale, expected) => {
    const response = getDeterministicChatResponse(question, locale);
    expect(response).toBe(expected);
    expect(response).not.toMatch(/enviado|sent successfully/i);
  });

  it("answers generic professional experience questions deterministically", () => {
    const response = getDeterministicChatResponse(
      "¿Qué experiencia profesional tiene Antonio?",
      "es",
    );
    expect(response).not.toBeNull();
    expect(response).toContain("Innobyte");
  });

  it.each([
    ["¿Cómo me puedes ayudar?", "¡Claro! Puedo ayudarte"],
    ["Hola, ¿cómo me puedes ayudar?", "¡Claro! Puedo ayudarte"],
    ["How can you help me?", "Of course! I can help"],
  ])("answers help request %s warmly and deterministically", (question, expected) => {
    expect(getDeterministicChatResponse(question)).toContain(expected);
  });
});
