import { describe, expect, it } from "vitest";
import { INTRO_TIMING, shouldShowIntro } from "./intro-sequence";

describe("initial intro sequence", () => {
  it("runs only when the session has not seen it", () => {
    expect(shouldShowIntro(null, false)).toBe(true);
    expect(shouldShowIntro("1", false)).toBe(false);
  });

  it("runs again after an explicit browser reload", () => {
    expect(shouldShowIntro("1", false, true)).toBe(true);
  });

  it("does not block visitors who prefer reduced motion", () => {
    expect(shouldShowIntro(null, true)).toBe(false);
    expect(shouldShowIntro("1", true, true)).toBe(false);
  });

  it("finishes within the 2.4 second presentation budget", () => {
    expect(INTRO_TIMING.exit + INTRO_TIMING.exitDuration).toBeLessThanOrEqual(
      2_400,
    );
  });

  it("resolves the identity before beginning the exit", () => {
    expect(INTRO_TIMING.resolve).toBeLessThan(INTRO_TIMING.exit);
  });
});
