import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@landing/styles/aos.css";
import "@landing/styles/globals.css";
import Aos from "@landing/components/Aos";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { getDefaultOgImageUrl, getSiteUrl } from "@landing/lib/seo/site";
import { SIGNED_IN_HINT_KEY } from "@shared/contract";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = getSiteUrl();
const defaultOg = getDefaultOgImageUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: PAGE_SETTINGS.homepage.title,
    template: "%s",
  },
  description: PAGE_SETTINGS.homepage.desc,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Field",
    title: PAGE_SETTINGS.homepage.title,
    description: PAGE_SETTINGS.homepage.desc,
    url: siteUrl,
    images: [
      {
        url: defaultOg,
        width: 1200,
        height: 630,
        alt: "Field",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SETTINGS.homepage.title,
    description: PAGE_SETTINGS.homepage.desc,
    images: [defaultOg],
  },
};

// Marks <html data-signed-in> before the first paint when the dashboard has a
// session, so the header shows "Dashboard" instead of "Sign in" without a
// flash. Pages stay static: the server never needs to know who is signed in.
const SIGNED_IN_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(SIGNED_IN_HINT_KEY)}))document.documentElement.setAttribute('data-signed-in','')}catch(e){}`;

// Root layout of the landing. Its stylesheets (Tailwind with preflight, the
// scroll animations) never reach the dashboard: it has its own root layout,
// and moving between the two is a full page load.
export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The script above sets data-signed-in before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SIGNED_IN_SCRIPT }} />
      </head>
      <body className={inter.variable}>
        <Aos />
        {children}
      </body>
    </html>
  );
}
