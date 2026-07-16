import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, resolveStoredTheme } from "./theme";

describe("theme initialization", () => {
  it("restores supported stored themes", () => {
    expect(resolveStoredTheme("light")).toBe("light");
    expect(resolveStoredTheme("dark")).toBe("dark");
  });

  it("falls back to the dark default for missing or invalid values", () => {
    expect(resolveStoredTheme(null)).toBe(DEFAULT_THEME);
    expect(resolveStoredTheme("system")).toBe(DEFAULT_THEME);
  });
});
