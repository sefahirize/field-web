import { BRAND, ROUTES } from "@shared/contract";

// Stands in for the landing until step 2.
export function LandingPlaceholder() {
  return (
    <main>
      <h1>{BRAND.name}</h1>
      <a href={ROUTES.dashboard}>Dashboard</a>
    </main>
  );
}
