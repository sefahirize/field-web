import { fileURLToPath } from "node:url";
import { transformWithOxc, type Plugin } from "vite";
import { defineConfig } from "vitest/config";

// The same aliases as "paths" in tsconfig.json.
const dir = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// A few dashboard .js files hold JSX (data/index.js). Next accepts that; Vite
// parses .js as plain JavaScript, so those files are compiled as JSX first.
const dashboardJsxInJs: Plugin = {
  name: "dashboard-jsx-in-js",
  enforce: "pre",
  transform(code, id) {
    if (!/\/src\/dashboard\/.*\.js$/.test(id)) return null;
    return transformWithOxc(code, id, { lang: "jsx", jsx: { runtime: "automatic" } });
  },
};

// Next imports an image as `{ src, width, height }`; Vite as a bare URL string.
// Tests get Next's shape, with the file's path from the project root as `src`.
const nextStaticImages: Plugin = {
  name: "next-static-images",
  enforce: "pre",
  load(id) {
    const file = id.split("?")[0];
    if (!/\.(png|jpe?g|gif|webp|avif|ico)$/.test(file)) return null;
    const src = "/" + file.slice(dir("./").length);
    return `export default ${JSON.stringify({ src, width: 0, height: 0 })};`;
  },
};

// Unit tests, one project per layer (CLAUDE.md, isolation rule 7): each layer's
// tests live next to its code and run without the other layer.
export default defineConfig({
  plugins: [dashboardJsxInJs, nextStaticImages],
  resolve: {
    alias: {
      "@dashboard": dir("./src/dashboard"),
      "@shared": dir("./src/shared"),
      "@public": dir("./public"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "dashboard",
          include: ["src/dashboard/**/*.test.{js,jsx}"],
          environment: "jsdom",
          setupFiles: ["src/dashboard/test/setup.jsx"],
        },
      },
    ],
  },
});
