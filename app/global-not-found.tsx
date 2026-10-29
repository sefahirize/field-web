import type { Metadata } from "next";
import { BRAND, ROUTES } from "@shared/contract";

export const metadata: Metadata = {
  title: `Page not found | ${BRAND.name}`,
  robots: { index: false, follow: true },
};

// Rendered for URLs that match no route, outside both root layouts.
// Gets its real design when the landing is ported (step 2).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <h1>404</h1>
        <p>This page does not exist.</p>
        <a href={ROUTES.home}>Back to {BRAND.name}</a>
      </body>
    </html>
  );
}
