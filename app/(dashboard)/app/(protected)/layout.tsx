import { RequireAuth } from "@dashboard/components/layouts/RequireAuth";

// Every page under this group is behind the auth gate and inside the
// signed-in chrome (sidebar, header). The layout stays mounted while moving
// between those pages, as the router outlet did in the CRA app.
export default function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
