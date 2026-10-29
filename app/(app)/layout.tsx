import type { Metadata } from "next";
import { BRAND, SITE_URL } from "@shared/contract";
import "@dashboard/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND.name,
  robots: { index: false, follow: false },
};

// Root layout of the dashboard. MUI and SCSS (step 4) load only here.
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
