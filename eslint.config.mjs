import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Layer isolation (see CLAUDE.md, "Isolation rules"): landing and dashboard
// never import each other, only src/shared. A violation is an error, and
// `pnpm build` runs lint first, so it fails the build.
const LANDING = ["./src/landing", "./app/(landing)"];
const DASHBOARD = ["./src/dashboard", "./app/(app)"];

const MUI = { group: ["@mui/*", "@emotion/*"], message: "MUI and emotion load only in the dashboard." };
const SCSS = { group: ["*.scss", "*.sass"], message: "SCSS loads only in the dashboard." };
const TAILWIND = {
  group: ["tailwindcss", "tailwindcss/*", "@tailwindcss/*"],
  message: "Tailwind loads only in the landing.",
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Resolves every import (alias or relative) before checking it.
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: LANDING,
              from: DASHBOARD,
              message: "The landing must not import dashboard code. Use src/shared.",
            },
            {
              target: DASHBOARD,
              from: LANDING,
              message: "The dashboard must not import landing code. Use src/shared.",
            },
            {
              target: "./src/shared",
              from: ["./src/landing", "./src/dashboard", "./app"],
              message: "src/shared is the contract; it imports nothing from the layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/landing/**", "app/(landing)/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["@dashboard/*"], message: "Use @shared/* instead." }, MUI, SCSS] },
      ],
    },
  },
  {
    files: ["src/dashboard/**", "app/(app)/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["@landing/*"], message: "Use @shared/* instead." }, TAILWIND] },
      ],
    },
  },
  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@landing/*", "@dashboard/*"], message: "src/shared imports nothing from the layers." },
            MUI,
            SCSS,
            TAILWIND,
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
