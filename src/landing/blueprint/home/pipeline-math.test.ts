import { describe, expect, it } from "vitest";

import { STEP_COUNT, fillAt, scrollProgress, scrollTopFor, stepAt } from "./pipeline-math";

describe("scrollProgress", () => {
  it("is 0 before the section reaches the top and 1 once it has scrolled through", () => {
    expect(scrollProgress(300, 4000, 1000)).toBe(0);
    expect(scrollProgress(0, 4000, 1000)).toBe(0);
    expect(scrollProgress(-1500, 4000, 1000)).toBe(0.5);
    expect(scrollProgress(-3000, 4000, 1000)).toBe(1);
    expect(scrollProgress(-5000, 4000, 1000)).toBe(1);
  });

  it("is null when the section is no taller than the viewport", () => {
    expect(scrollProgress(0, 800, 1000)).toBeNull();
    expect(scrollProgress(0, 1000, 1000)).toBeNull();
  });
});

describe("stepAt", () => {
  it("splits the scroll into equal stretches, one per step", () => {
    expect(stepAt(0)).toBe(0);
    expect(stepAt(0.24)).toBe(0);
    expect(stepAt(0.25)).toBe(1);
    expect(stepAt(0.6)).toBe(2);
    expect(stepAt(0.99)).toBe(3);
  });

  it("stays on the last step at the very end and clamps out-of-range input", () => {
    expect(stepAt(1)).toBe(STEP_COUNT - 1);
    expect(stepAt(1.4)).toBe(STEP_COUNT - 1);
    expect(stepAt(-0.2)).toBe(0);
  });
});

describe("fillAt", () => {
  it("fills earlier bars, grows the current one and leaves later ones empty", () => {
    const progress = 0.375; // halfway through step 1
    expect(fillAt(progress, 0)).toBe(1);
    expect(fillAt(progress, 1)).toBe(0.5);
    expect(fillAt(progress, 2)).toBe(0);
  });
});

describe("scrollTopFor", () => {
  it("lands in the middle of each step's stretch", () => {
    const run = 3000;
    for (let i = 0; i < STEP_COUNT; i++) {
      const top = scrollTopFor(1000, run, i);
      const progress = scrollProgress(1000 - top, run + 1000, 1000)!;
      expect(stepAt(progress)).toBe(i);
      expect(fillAt(progress, i)).toBeCloseTo(0.5);
    }
  });
});
