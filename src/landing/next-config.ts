import type { NextConfig } from "next";

/**
 * The landing's part of next.config.ts. The root file combines it with the
 * dashboard's part and the app-wide hosting rules; if the landing ever becomes
 * its own project, this part moves into that project's next.config.ts.
 */

// Third parties the landing's pages talk to: reCAPTCHA (contact form) and the
// Hirize API (AI agents e-mail form).
const RECAPTCHA = ["https://www.google.com", "https://www.gstatic.com", "https://www.recaptcha.net"];
const HIRIZE_API = ["https://connect.hirize.hr"];

/** Origins the landing adds to the Content-Security-Policy. */
export const landingCsp = {
  "script-src": RECAPTCHA,
  "connect-src": [...HIRIZE_API, ...RECAPTCHA],
  "frame-src": RECAPTCHA,
};

export const landingNextConfig: NextConfig = {
  experimental: {
    // Needed because the landing and dashboard groups each have their own root layout,
    // so there is no single layout to render an app-wide 404 in.
    globalNotFound: true,
  },
};
