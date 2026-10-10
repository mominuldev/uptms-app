// @ts-check
import { execSync } from "node:child_process";

// Plain JavaScript on purpose. Production is built by Hostinger's hPanel
// Node.js deployment, which runs `next build` from the repository and
// publishes `.next/standalone`. Given a next.config.ts it swaps in a stock
// standalone config of its own, which would drop cacheComponents and the
// Tailwind rule below. This file it reads as-is, which is why `output` is
// set here rather than left to the host.

/**
 * The commit this build came from, for the `x-commit` response header.
 * The deploy workflow compares it with the pushed SHA to tell a publish that
 * landed from one that failed silently and left the previous version serving.
 */
function commitSha() {
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return process.env.GITHUB_SHA ?? "unknown";
  }
}

const commit = commitSha();

/** @type {import("next").NextConfig} */
const nextConfig = {
  // The end-to-end run (uptms-ad playwright.config.ts) builds into its own
  // directory so it never disturbs a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // What hPanel publishes: `.next/standalone/server.js` beside `.next/static` and `public`.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "x-commit", value: commit }] }];
  },
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
