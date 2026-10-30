import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Third parties the browser talks to: reCAPTCHA (contact form) and the
// Field/Hirize API (pricing calculator, AI agents e-mail form). Images may
// come from any HTTPS host (WordPress, YouTube thumbnails).
//
// Scripts keep 'unsafe-inline' because Next.js inlines its bootstrap
// scripts; a nonce would make every page dynamic. The policy still blocks
// scripts from any other origin, eval, plugins, <base> hijacking, foreign
// form targets and framing.
const RECAPTCHA = ["https://www.google.com", "https://www.gstatic.com", "https://www.recaptcha.net"];
const API = ["https://connect.hirize.hr"];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}${RECAPTCHA.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${API.join(" ")} ${RECAPTCHA.join(" ")}${isDev ? " ws: wss:" : ""}`,
  `frame-src ${RECAPTCHA.join(" ")}`,
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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Needed because the landing and dashboard groups each have their own root layout,
    // so there is no single layout to render an app-wide 404 in.
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
