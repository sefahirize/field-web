import type { Metadata, Viewport } from "next";
import { BRAND, SITE_URL } from "@shared/contract";
import { AppProviders } from "@dashboard/components/layouts/AppProviders";
import "@dashboard/styles/main.scss";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND.name} Dashboard`,
  description: `${BRAND.name} Dashboard`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0C",
};

// Applies the saved theme and layout before the first paint, so a dark choice
// does not flash white. Mirrors src/dashboard/libs/themeMode.jsx (light is the
// default).
const PRE_PAINT = `(function () {
  try {
    var pref = localStorage.getItem('joinfield-theme');
    var dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    var layout = localStorage.getItem('joinfield-layout');
    document.documentElement.setAttribute('data-layout', layout === 'rail' ? 'rail' : 'classic');
    if (dark) document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0B0B0A');
  } catch (e) {}
})();`;

// Root layout of the dashboard. MUI and SCSS load only here.
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The pre-paint script sets data-theme / data-layout before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
