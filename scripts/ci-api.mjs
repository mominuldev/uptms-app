// A stand-in for the Laravel API in CI: replays recorded public responses
// (test/api/fixtures.json, the seeded Figma content) so `next build` can
// prerender the site without uptms-ad running. Anything not recorded
// answers the API's own 404 envelope. Never used outside CI.
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const fixtures = JSON.parse(readFileSync(new URL("../test/api/fixtures.json", import.meta.url), "utf8"));
const port = Number(process.env.PORT ?? 8000);

createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const key = url.pathname.replace(/^\/api\/v1\//, "") + url.search;
  const body = fixtures[key] ?? { success: false, message: "Not found.", error_code: "NOT_FOUND", errors: [], meta: { request_id: "ci" } };

  response.writeHead(fixtures[key] ? 200 : 404, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}).listen(port, () => console.log(`CI API stub on :${port} (${Object.keys(fixtures).length} responses)`));
