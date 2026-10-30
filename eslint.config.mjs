import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Layer isolation (see CLAUDE.md, "Isolation rules"): landing and dashboard
// never import each other, only src/shared. A violation is an error, and
// `pnpm build` runs lint first, so it fails the build.
//
// Each layer is a route group in app/ plus a folder in src/ with the same name.
// To rename a layer: rename both folders, change `name` here and the alias in
// tsconfig.json. Route groups never appear in URLs, so no link changes.
const layer = (name, alias) => ({
  alias: `${alias}/*`,
  paths: [`./src/${name}`, `./app/(${name})`],
  files: [`src/${name}/**`, `app/(${name})/**`],
});

const LANDING = layer("landing", "@landing");
const DASHBOARD = layer("dashboard", "@dashboard");

const MUI = { group: ["@mui/*", "@emotion/*"], message: "MUI and emotion load only in the dashboard." };
const SCSS = { group: ["*.scss", "*.sass"], message: "SCSS loads only in the dashboard." };
const TAILWIND = {
  group: ["tailwindcss", "tailwindcss/*", "@tailwindcss/*"],
  message: "Tailwind loads only in the landing.",
};
const preferShared = alias => ({ group: [alias], message: "Use @shared/* instead." });

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
              target: LANDING.paths,
              from: DASHBOARD.paths,
              message: "The landing must not import dashboard code. Use src/shared.",
            },
            {
              target: DASHBOARD.paths,
              from: LANDING.paths,
              message: "The dashboard must not import landing code. Use src/shared.",
            },
            {
              target: "./src/shared",
              from: ["./src", "./app"],
              except: ["./shared"],
              message: "src/shared is the contract; it imports nothing from the layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: LANDING.files,
    rules: {
      "no-restricted-imports": ["error", { patterns: [preferShared(DASHBOARD.alias), MUI, SCSS] }],
    },
  },
  {
    files: DASHBOARD.files,
    rules: {
      "no-restricted-imports": ["error", { patterns: [preferShared(LANDING.alias), TAILWIND] }],
    },
  },
  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: [LANDING.alias, DASHBOARD.alias], message: "src/shared imports nothing from the layers." },
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
