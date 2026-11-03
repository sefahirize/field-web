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
const layer = (name, alias, rootFiles = []) => ({
  alias: `${alias}/*`,
  paths: [`./src/${name}`, `./app/(${name})`, ...rootFiles.map(file => `./${file}`)],
  files: [`src/${name}/**`, `app/(${name})/**`, ...rootFiles],
});

// Next wants these at the root of app/, outside any route group; they are the landing's.
const LANDING = layer("landing", "@landing", ["app/robots.ts", "app/sitemap.ts", "app/global-not-found.tsx"]);
const DASHBOARD = layer("dashboard", "@dashboard");

// Which layer owns each runtime package in package.json. The other layer may
// not import it, so if the layers become separate projects, each package.json
// is its own list plus what both use: next, react, react-dom, react-hook-form.
// A package both layers need goes in neither list.
const PACKAGES = {
  landing: [
    "@hookform/resolvers",
    "country-flag-icons",
    "libphonenumber-js",
    "react-google-recaptcha-v3",
    "sanitize-html",
    "zod",
    "tailwindcss",
    "@tailwindcss/*",
  ],
  dashboard: ["@emotion/*", "@mui/*", "@reduxjs/*", "axios", "notistack", "react-redux", "sass"],
};
const ownedBy = name => ({
  group: PACKAGES[name].flatMap(pkg => [pkg, `${pkg}/*`]),
  message: `This package belongs to the ${name} (PACKAGES in eslint.config.mjs).`,
});
const SCSS = { group: ["*.scss", "*.sass"], message: "SCSS loads only in the dashboard." };
const preferShared = alias => ({ group: [alias], message: "Use @shared/* instead." });

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `const { secret, ...rest } = body` is the usual way to drop a field.
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
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
      "no-restricted-imports": ["error", { patterns: [preferShared(DASHBOARD.alias), ownedBy("dashboard"), SCSS] }],
      // Off in joinfield-landing too; the copy is full of apostrophes.
      "react/no-unescaped-entities": "off",
      // The landing was ported 1:1. Moving its <img> tags to next/image can
      // change the layout, so it waits for the upgrade/redesign step.
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: DASHBOARD.files,
    rules: {
      "no-restricted-imports": ["error", { patterns: [preferShared(LANDING.alias), ownedBy("landing")] }],
      // The dashboard was ported as-is from a CRA app written before this
      // React Compiler rule; revisit it with the TypeScript migration.
      "react-hooks/set-state-in-effect": "off",
      // Not in CRA's lint config either; the copy uses plain apostrophes.
      "react/no-unescaped-entities": "off",
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
            ownedBy("landing"),
            ownedBy("dashboard"),
            SCSS,
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
