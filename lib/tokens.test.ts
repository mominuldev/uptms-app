import { describe, expect, it } from "vitest";
import { settings } from "@/test/site-fixtures";
import { fillTokens, resolveLink } from "./tokens";

describe("content tokens", () => {
  it("fills the clinic phone, hours and email from settings", () => {
    expect(fillTokens("Call {phone} · {hours} · {email}", settings)).toBe("Call 253-234-4199 · Mon–Fri · 8:00 AM–5:00 PM · contact@uptms.com");
  });

  it("resolves tel:clinic and drops half-filled links", () => {
    expect(resolveLink({ label: "Call {phone}", href: "tel:clinic" }, settings)).toEqual({ label: "Call 253-234-4199", href: "tel:+12532344199" });
    expect(resolveLink({ label: "", href: "/quiz" }, settings)).toBeNull();
    expect(resolveLink(null, settings)).toBeNull();
  });
});
