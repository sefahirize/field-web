import { BRAND, ROUTES } from "@shared/contract";

// Stands in for the dashboard until step 4.
export function DashboardPlaceholder() {
  return (
    <main>
      <h1>{BRAND.name} dashboard</h1>
      <a href={ROUTES.home}>Home</a>
    </main>
  );
}
