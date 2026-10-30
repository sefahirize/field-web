import type { Config } from "tailwindcss";

export default {
  // Landing files only, so no dashboard class ends up in the landing CSS.
  // Write the route group as-is: Tailwind 3 matches "(landing)" literally,
  // and an escaped "\\(" turns into a path separator and matches nothing.
  content: [
    "./src/landing/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(landing)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/global-not-found.tsx",
  ],
  theme: {
    extend: {
      screens: {
        'lgx': '1150px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "dark-secondary": "#121212",
        "card-border": "#E1E1E2",
        "tag-border": "#041527",
        "natural-gray-bg": "#F5F5F6",
        "natural-gray-text": "#223140",
        "natural-gray-border": "#E1E1E2",
        "natural-navy": "#242729",
        "natural-gray-default": "#6C7A8E",
        "nature-black": "#0F0F13",
        "natural-gray-tint": "#BAC1CC",
        "natural-navy-dark": "#040F4B",
        "natural-black": "#01092F",
        "natural-green": "#0A1C20",
        "auxiliary-blue-tint": "#E1DDFE",
        "gray-tint": "#A4ACB9",
        "gray-border-dark": "#E9EAEB",
        "app-blue": "#3A5AFF",
        "gray-default": "#818898"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        eudoxus: ["var(--font-eudoxus-sans)", "sans-serif"],
      },
      fontWeight: {
        extralight: "100",
        light: "300",
        regular: "400",
        medium: "500",
        bold: "700",
        extrabold: "800",
      },
      maxWidth: {
        'lg': '1080px',
        '8xl': '1440px',
        '1304': '1304px'
      },
      spacing: {
        '3.5': '14px',
        '4.5': '40px'
      },
      fontSize: {
        '4.5': '40px'
      }
    },
  },
  plugins: [],
} satisfies Config;
