import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";

// The Blueprint design's three families, self-hosted by next/font at build
// time (no request to Google from the browser). Each one sets a CSS variable
// that site.module.css maps to --fb, --fm and --fh.

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

/** Put on the element that wraps a Blueprint page. */
export const blueprintFonts = [geist.variable, geistMono.variable, sourceSerif.variable].join(" ");
