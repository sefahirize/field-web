import type { NextConfig } from "next";

// Sent on every response. A Content-Security-Policy is added once the
// third parties (reCAPTCHA, blog images, analytics) are ported and known.
const securityHeaders = [
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
    // Needed because (landing) and (app) each have their own root layout,
    // so there is no single layout to render an app-wide 404 in.
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
