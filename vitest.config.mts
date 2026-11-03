import { defineConfig } from "vitest/config";

// Unit tests, one project per layer (CLAUDE.md, isolation rule 7). Each layer
// keeps its own config next to its code (src/<layer>/vitest.config.mts) and
// runs without the other layer.
export default defineConfig({
  test: {
    projects: ["src/*/vitest.config.mts"],
  },
});
