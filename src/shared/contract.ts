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

function readUrl(name: string, value: string | undefined, fallback: string): string {
  const raw = value || fallback;
  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(`${name} must be an absolute URL, got "${raw}"`);
  }
}

/**
 * Origin of the dashboard when it runs apart from the landing (its own project
 * or host, e.g. https://app.joinfield.ai). Empty, the default, means both run
 * in this app and the routes below stay relative paths.
 */
// Referenced literally so Next inlines it into the client bundle.
const DASHBOARD_ORIGIN = process.env.NEXT_PUBLIC_DASHBOARD_URL
  ? readUrl("NEXT_PUBLIC_DASHBOARD_URL", process.env.NEXT_PUBLIC_DASHBOARD_URL, "")
  : "";
const dashboardUrl = (path: string) => `${DASHBOARD_ORIGIN}${APP_BASE}${path}`;

/**
 * Dashboard entry points from outside the dashboard: the landing's links, and
 * the links the backend sends (verification email, Stripe return).
 */
export const ROUTES = {
  home: "/",
  dashboard: dashboardUrl(""),
  login: dashboardUrl("/login"),
  register: dashboardUrl("/register"),
  /** Takes `?basket_id=` (a basket priced on the pricing page) or `?plan=<productId>:<count>,...`. */
  checkout: dashboardUrl("/checkout"),
  verifyEmail: dashboardUrl("/verify-email"),
  resetPassword: dashboardUrl("/reset-password"),
  checkoutSuccess: dashboardUrl("/checkout/success"),
} as const;

/**
 * localStorage key set while someone is signed in to the dashboard, so the
 * landing can offer "Dashboard" instead of "Sign in". A hint, not a
 * credential: it holds no token, and the dashboard still checks the session
 * itself. The dashboard writes it next to its tokens; the landing only reads it.
 *
 * localStorage is per origin, so this works only while both run on the same
 * origin. With NEXT_PUBLIC_DASHBOARD_URL set it must become a cookie on the
 * parent domain (.joinfield.ai); until then the landing just shows "Sign in".
 */
export const SIGNED_IN_HINT_KEY = "jf_signed_in";

// Referenced literally so Next inlines it into the client bundle.
export const SITE_URL = readUrl(
  "NEXT_PUBLIC_SITE_URL",
  process.env.NEXT_PUBLIC_SITE_URL,
  "http://localhost:3000",
);
