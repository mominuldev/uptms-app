// @ts-check
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// Plain JavaScript on purpose. Production is built by Hostinger's hPanel
// Node.js deployment, which runs `next build` from the repository and
// publishes `.next/standalone`. Given a next.config.ts it swaps in a stock
// standalone config of its own, which would drop cacheComponents. This file
// it reads as-is, which is why `output` is set here rather than left to the
// host. Tailwind is wired up in postcss.config.mjs.

/**
 * The commit this build came from, for the `x-commit` response header.
 * The deploy workflow compares it with the pushed SHA to tell a publish that
 * landed from one that failed silently and left the previous version serving.
 */
function commitSha() {
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    // hPanel's Node build environment has no `git` on its PATH, so read the
    // ref ourselves rather than publish a build that cannot name its commit.
    return shaFromGitDir(process.cwd()) ?? process.env.COMMIT_SHA ?? process.env.GITHUB_SHA ?? "unknown";
  }
}

/**
 * HEAD read straight from the git directory, walking up from `start` so it
 * works whether `next build` runs at the repository root or below it.
 * Returns undefined when there is no readable .git to be found.
 */
function shaFromGitDir(start) {
  for (let dir = resolve(start); ; ) {
    const gitDir = join(dir, ".git");
    try {
      const head = readFileSync(join(gitDir, "HEAD"), "utf8").trim();
      // A detached HEAD holds the sha itself; a normal one points at a ref.
      if (!head.startsWith("ref:")) return head;
      const ref = head.slice(4).trim();
      try {
        return readFileSync(join(gitDir, ref), "utf8").trim();
      } catch {
        // A fresh clone keeps its refs packed instead of as loose files.
        const line = readFileSync(join(gitDir, "packed-refs"), "utf8")
          .split("\n")
          .find((entry) => entry.endsWith(` ${ref}`));
        if (line) return line.split(" ")[0];
      }
    } catch {
      // Nothing readable here; the parent directory may still hold the repo.
    }
    const parent = dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

const commit = commitSha();

// Fail the build rather than ship a site that cannot reach its API: every page
// prerenders from it, so a missing origin is a deploy that serves nothing.
// .env.production carries it for hPanel; CI passes its own.
if (!process.env.API_URL && process.argv.includes("build")) {
  throw new Error("API_URL is not set. It must exist when `next build` runs (see .env.production and .env.example).");
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  // The end-to-end run (uptms-ad playwright.config.ts) builds into its own
  // directory so it never disturbs a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // What hPanel publishes: `.next/standalone/server.js` beside `.next/static` and `public`.
  output: "standalone",
  // Inline the API origin into the server bundle. The standalone server.js does
  // not read .env files and hPanel's runtime environment is not guaranteed to
  // repeat it, so what was present at build time is what the server uses.
  // Nothing in the browser bundle reads it (lib/api.ts is server-only).
  env: { API_URL: process.env.API_URL ?? "" },
  cacheComponents: true,
  partialPrefetching: true,
  // Let `next dev` tell an agent to pick up security releases on its own.
  experimental: { agentUpgrade: "security" },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "x-commit", value: commit }] }];
  },
};

export default nextConfig;
