import { fileURLToPath } from "node:url";
import { transformWithOxc, type Plugin } from "vite";
import { defineConfig } from "vitest/config";

// The dashboard's unit tests. Self-contained: the paths below are relative to
// this folder, so the config moves with the dashboard if it becomes its own
// project. The root vitest.config.mts only lists it.

const dir = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const ROOT = dir("./");

// A few dashboard .js files hold JSX (data/index.js). Next accepts that; Vite
// parses .js as plain JavaScript, so those files are compiled as JSX first.
const jsxInJs: Plugin = {
  name: "dashboard-jsx-in-js",
  enforce: "pre",
  transform(code, id) {
    if (!id.startsWith(ROOT) || !id.endsWith(".js")) return null;
    return transformWithOxc(code, id, { lang: "jsx", jsx: { runtime: "automatic" } });
  },
};

// Next imports an image as `{ src, width, height }`; Vite as a bare URL string.
// Tests get Next's shape, with the file's path from this folder as `src`.
const nextStaticImages: Plugin = {
  name: "next-static-images",
  enforce: "pre",
  load(id) {
    const file = id.split("?")[0];
    if (!/\.(png|jpe?g|gif|webp|avif|ico)$/.test(file)) return null;
    const src = "/" + file.slice(ROOT.length);
    return `export default ${JSON.stringify({ src, width: 0, height: 0 })};`;
  },
};

export default defineConfig({
  plugins: [jsxInJs, nextStaticImages],
  resolve: {
    // The same aliases as "paths" in tsconfig.json.
    alias: {
      "@dashboard": ROOT,
      "@shared": dir("../shared"),
      "@public": dir("../../public"),
    },
  },
  test: {
    name: "dashboard",
    root: ROOT,
    include: ["**/*.test.{js,jsx}"],
    environment: "jsdom",
    setupFiles: ["test/setup.jsx"],
  },
});
