// Tailwind runs as a PostCSS plugin, the integration Next documents
// (node_modules/next/dist/docs/01-app/01-getting-started/11-css.md).
//
// It replaced a `turbopack.rules` entry that ran @tailwindcss/turbopack as a
// webpack loader: Turbopack spawns a Node subprocess for that bridge, and on
// Hostinger that subprocess exits before Turbopack can connect to it, so
// `next build` died there with a TurbopackInternalError on app/globals.css
// while the same commit built fine in CI. The sibling centennial-celebration
// site builds on the same host through this plugin.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
