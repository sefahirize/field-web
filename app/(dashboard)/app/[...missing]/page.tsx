import { notFound } from "next/navigation";

// Any /app address no page claims ends up here, so it gets the dashboard's 404
// (app/not-found.tsx next to this folder) instead of the landing's global one.
export default function MissingDashboardPage() {
  notFound();
}
