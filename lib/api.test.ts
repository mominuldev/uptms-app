import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiUrl, getData } from "./api";

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

beforeEach(() => vi.stubEnv("API_URL", "http://api.test/api/v1/"));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("api", () => {
  it("joins the base URL and path without double slashes", () => {
    expect(apiUrl("/public/pages/home")).toBe("http://api.test/api/v1/public/pages/home");
  });

  it("refuses to run without API_URL", () => {
    vi.stubEnv("API_URL", "");
    expect(() => apiUrl("health")).toThrow(/API_URL is not set/);
  });

  it("unwraps the success envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json(200, { success: true, message: "OK", data: { status: "ok" }, meta: {} }));

    await expect(getData<{ status: string }>("health")).resolves.toEqual({ status: "ok" });
  });

  it("raises the stable error code and request id", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json(503, { success: false, message: "The database is not reachable.", error_code: "SERVICE_UNAVAILABLE", errors: {}, meta: { request_id: "req-7" } }),
    );

    const error = (await getData("health").catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 503, code: "SERVICE_UNAVAILABLE", requestId: "req-7" });
  });

  it("maps a connection failure to NETWORK_ERROR", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("fetch failed"));

    await expect(getData("health")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 });
  });
});
