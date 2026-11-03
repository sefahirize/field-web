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

/**
 * URL prefix of the whole dashboard; the landing owns everything else.
 *
 * Must match the folder app/(dashboard)/app/. To move the dashboard
 * (e.g. to "/dashboard"), rename that folder and change this value.
 */
export const APP_BASE = "/app";

/**
 * Same-origin path of the Field API; next.config.ts proxies it to the API
 * host. The landing's pricing calculator uses its public endpoints
 * (GET products, POST products/price), the same ones Buy credits uses.
 */
export const API_BASE = "/api/v1";

/**
 * Dashboard entry points from outside the dashboard: the landing's links, and
 * the links the backend sends (verification email, Stripe return).
 */
export const ROUTES = {
  home: "/",
  dashboard: APP_BASE,
  login: `${APP_BASE}/login`,
  register: `${APP_BASE}/register`,
  /** Takes `?basket_id=` (a basket priced on the pricing page) or `?plan=<productId>:<count>,...`. */
  checkout: `${APP_BASE}/checkout`,
  verifyEmail: `${APP_BASE}/verify-email`,
  resetPassword: `${APP_BASE}/reset-password`,
  checkoutSuccess: `${APP_BASE}/checkout/success`,
} as const;

/**
 * localStorage key set while someone is signed in to the dashboard, so the
 * landing can offer "Dashboard" instead of "Sign in". A hint, not a
 * credential: it holds no token, and the dashboard still checks the session
 * itself. The dashboard writes it next to its tokens; the landing only reads it.
 */
export const SIGNED_IN_HINT_KEY = "jf_signed_in";

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
