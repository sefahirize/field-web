import type { NextConfig } from "next";

/**
 * The dashboard's part of next.config.ts. The root file combines it with the
 * landing's part and the app-wide hosting rules; if the dashboard ever becomes
 * its own project, this part moves into that project's next.config.ts.
 */

/** Origins the dashboard adds to the Content-Security-Policy: none, it only talks to its own origin. */
export const dashboardCsp = {};

export const dashboardNextConfig: NextConfig = {
  sassOptions: {
    // The dashboard SCSS still uses @import; moving it to @use is its own job.
    silenceDeprecations: ["import"],
  },
};
