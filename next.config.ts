import type { NextConfig } from "next";
import { ROUTES } from "./src/shared/contract";
import { landingCsp, landingNextConfig } from "./src/landing/next-config";
import { dashboardCsp, dashboardNextConfig } from "./src/dashboard/next-config";

// Each layer owns its part of the config (src/<layer>/next-config.ts). This
// file only combines them and adds the rules that belong to the host, not to
// a layer: security headers, the API proxy and the backend's links. If the
// layers become separate projects, each copies these host rules (the
// backend's links go with whichever project owns the domain root).

const isDev = process.env.NODE_ENV !== "production";

// Origins each layer adds to the policy below.
const CSP_PARTS: Partial<Record<string, string[]>>[] = [landingCsp, dashboardCsp];
const cspSources = (directive: string) => CSP_PARTS.flatMap(part => part[directive] ?? []).join(" ");

// Images may come from any HTTPS host (WordPress, YouTube thumbnails).
//
// Scripts keep 'unsafe-inline' because Next.js inlines its bootstrap
// scripts; a nonce would make every page dynamic. The policy still blocks
// scripts from any other origin, eval, plugins, <base> hijacking, foreign
// form targets and framing.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}${cspSources("script-src")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${cspSources("connect-src")}${isDev ? " ws: wss:" : ""}`,
  `frame-src ${cspSources("frame-src") || "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Sent on every response.
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // No includeSubDomains/preload yet: api.joinfield.ai does not serve HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// The Field API. The browser never calls it directly: it has no CORS headers
// and no working HTTPS yet, so /api/v1 and /uploads are proxied through this
// app (the CRA dev proxy and vercel.json did the same before). Both layers use
// it: the dashboard, and the landing's pricing calculator. Only these two
// prefixes are forwarded; the landing's own /api routes stay local.
const DASHBOARD_API_ORIGIN = process.env.DASHBOARD_API_ORIGIN || "http://api.joinfield.ai";

// Merges the host rules and the layers' parts. Two of them setting the same key
// would silently overwrite each other, so that fails instead: merge such a key
// here by hand.
const combine = (...parts: NextConfig[]): NextConfig => {
  const seen = new Set<string>();
  for (const key of parts.flatMap(part => Object.keys(part))) {
    if (seen.has(key)) throw new Error(`next.config: "${key}" is set twice; merge it in next.config.ts.`);
    seen.add(key);
  }
  return Object.assign({}, ...parts);
};

const hostConfig: NextConfig = {
  poweredByHeader: false,
  // The backend links into the dashboard without its prefix: the verification
  // email to /?token=..., the password reset email to /reset-password?token=...,
  // and Stripe returns to /?session_id=.... Forward those into the dashboard
  // here, at root level, so they keep working whatever the landing becomes.
  // The query string is passed through. A plain "/" stays the landing.
  async redirects() {
    return [
      { source: "/", has: [{ type: "query", key: "token" }], destination: ROUTES.verifyEmail, permanent: false },
      { source: "/", has: [{ type: "query", key: "session_id" }], destination: ROUTES.checkoutSuccess, permanent: false },
      { source: "/reset-password", destination: ROUTES.resetPassword, permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${DASHBOARD_API_ORIGIN}/api/v1/:path*` },
      { source: "/uploads/:path*", destination: `${DASHBOARD_API_ORIGIN}/uploads/:path*` },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default combine(hostConfig, landingNextConfig, dashboardNextConfig);
