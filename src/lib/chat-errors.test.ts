import { describe, expect, it } from "vitest";
import {
  ChatHttpError,
  classifyChatFailure,
  getChatFailureMessage,
} from "./chat-errors";

describe("chat failure classification", () => {
  it.each([
    [new ChatHttpError(429), "rate-limit"],
    [new ChatHttpError(503), "unavailable"],
    [new ChatHttpError(500), "unavailable"],
    [new ChatHttpError(400), "invalid-request"],
    [new TypeError("fetch failed"), "network"],
  ] as const)("classifies %s as %s", (error, expected) => {
    expect(classifyChatFailure(error)).toBe(expected);
  });

  it("classifies an aborted request as a timeout", () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    expect(classifyChatFailure(error)).toBe("timeout");
  });

  it("returns localized, actionable messages", () => {
    expect(getChatFailureMessage("timeout", "es")).toContain("tardó demasiado");
    expect(getChatFailureMessage("rate-limit", "en")).toContain("many requests");
  });
});
