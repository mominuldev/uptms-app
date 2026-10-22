import { describe, expect, it } from "vitest";
import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("matches Home only on the root path", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/tms", "/")).toBe(false);
    expect(isActivePath("/contact", "/")).toBe(false);
  });

  it("matches Home on the prerendered \"/index\" the home route reports", () => {
    expect(isActivePath("/index", "/")).toBe(true);
    expect(isActivePath("/index", "/tms")).toBe(false);
  });

  it("matches a section and the pages below it", () => {
    expect(isActivePath("/tms", "/tms")).toBe(true);
    expect(isActivePath("/tms/", "/tms")).toBe(true);
    expect(isActivePath("/tms/ocd", "/tms")).toBe(true);
  });

  it("does not match a sibling that only shares a prefix", () => {
    expect(isActivePath("/tmsx", "/tms")).toBe(false);
    expect(isActivePath("/quizzes", "/quiz")).toBe(false);
  });

  it("ignores query strings on the link and never marks anchors or external links current", () => {
    expect(isActivePath("/quiz", "/quiz?step=2")).toBe(true);
    expect(isActivePath("/", "/#care-team")).toBe(false);
    expect(isActivePath("/", "https://uptms.com")).toBe(false);
    expect(isActivePath("/", "tel:+12532344199")).toBe(false);
  });

  it("is false while the pathname is unknown", () => {
    expect(isActivePath(null, "/")).toBe(false);
    expect(isActivePath(undefined, "/tms")).toBe(false);
  });
});
