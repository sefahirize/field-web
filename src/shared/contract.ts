/**
 * The contract between the landing and the dashboard.
 *
 * Both layers may import this file; nothing else is shared between them.
 * Keep it to brand, routes, URLs and the landing -> dashboard entry points,
 * so the landing can be redesigned without touching the dashboard.
 */

export const BRAND = {
  name: "Field",
  domain: "joinfield.ai",
} as const;

/** Dashboard routes the landing links to. */
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  checkout: "/checkout",
} as const;

function readUrl(name: string, value: string | undefined, fallback: string): string {
  const raw = value || fallback;
  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(`${name} must be an absolute URL, got "${raw}"`);
  }
}

// Referenced literally so Next inlines it into the client bundle.
export const SITE_URL = readUrl(
  "NEXT_PUBLIC_SITE_URL",
  process.env.NEXT_PUBLIC_SITE_URL,
  "http://localhost:3000",
);
