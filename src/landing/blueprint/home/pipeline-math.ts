/**
 * The arithmetic of the pinned "How Field works" walkthrough: the section is
 * STEP_COUNT viewports tall, its stage sticks to the top, and how far the page
 * has scrolled through it picks the step.
 */

export const STEP_COUNT = 4;

/** How long each step shows when the walkthrough plays by itself. */
export const STEP_MS = 4200;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * 0 when the section's top meets the viewport's top, 1 when its bottom meets
 * the viewport's bottom. Null when the section is not taller than the viewport.
 */
export const scrollProgress = (top: number, height: number, viewport: number): number | null => {
  const run = height - viewport;
  if (run <= 0) return null;
  return clamp01(-top / run);
};

export const stepAt = (progress: number): number =>
  Math.min(STEP_COUNT - 1, Math.floor(clamp01(progress) * STEP_COUNT));

/** How full step `i`'s progress bar is (0 to 1) at this point of the scroll. */
export const fillAt = (progress: number, i: number): number => clamp01(progress * STEP_COUNT - i);

/** Where to scroll so that step `i` sits in the middle of its stretch. */
export const scrollTopFor = (sectionTop: number, run: number, i: number): number =>
  sectionTop + run * ((i + 0.5) / STEP_COUNT);
