import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The end-to-end run (uptms-ad playwright.config.ts) builds into its own
  // directory so it never disturbs a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
