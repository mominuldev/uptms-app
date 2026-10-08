import { describe, expect, it } from "vitest";
import { isUnknown, matchRedirect, normalisePath, type SiteRouting } from "./redirects";

const routing: SiteRouting = {
  rules: [
    { id: 1, from: "/ocd-treatment", to: "/conditions/ocd", status: 301, wildcard: false },
    { id: 2, from: "/blog/*", to: "/resources/$1", status: 301, wildcard: true },
    { id: 3, from: "/covid-update", to: null, status: 410, wildcard: false },
  ],
  paths: ["/", "/tms", "/conditions/ocd", "/resources", "/resources/first-visit"],
};

describe("redirect matching", () => {
  it("normalises like Laravel", () => {
    expect(normalisePath("/OCD-Treatment/")).toBe("/ocd-treatment");
    expect(normalisePath("/")).toBe("/");
  });

  it("matches exact and wildcard rules, and gone pages", () => {
    expect(matchRedirect(routing, "/OCD-treatment/")?.to).toBe("/conditions/ocd");
    expect(matchRedirect(routing, "/blog/first-visit")?.to).toBe("/resources/first-visit");
    expect(matchRedirect(routing, "/covid-update")?.rule.status).toBe(410);
    expect(matchRedirect(routing, "/tms")).toBeNull();
  });

  it("knows which addresses exist", () => {
    expect(isUnknown(routing, "/tms")).toBe(false);
    expect(isUnknown(routing, "/nope")).toBe(true);
    expect(isUnknown(routing, "/resources")).toBe(false);
    expect(isUnknown(routing, "/resources/first-visit")).toBe(false);
    expect(isUnknown(routing, "/resources/not-a-post")).toBe(true);
    expect(isUnknown(routing, "/_next/static/x.js")).toBe(false);
    expect(isUnknown(routing, "/images/logo.png")).toBe(false);
    expect(isUnknown(routing, "/apiary")).toBe(true);
  });
});
