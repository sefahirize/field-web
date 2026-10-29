import type { Metadata } from "next";
import { BRAND, SITE_URL } from "@shared/contract";
import "@landing/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND.name,
};

// Root layout of the landing. Its stylesheet (Tailwind from step 2)
// never reaches the dashboard: (app) has its own root layout, and moving
// between the two is a full page load.
export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
