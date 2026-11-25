import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The landing's unit tests. Self-contained like the dashboard's: the paths
// below are relative to this folder, so the config moves with the landing if
// it becomes its own project. The root vitest.config.mts only lists it.

const dir = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    // The same aliases as "paths" in tsconfig.json.
    alias: {
      "@landing": dir("./"),
      "@shared": dir("../shared"),
      "@public": dir("../../public"),
    },
  },
  test: {
    name: "landing",
    root: dir("./"),
    include: ["**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
