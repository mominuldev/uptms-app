import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifySignature } from "./revalidate";

const sign = (secret: string, timestamp: string, body: string) => createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

describe("revalidation webhook signature", () => {
  const body = JSON.stringify({ tags: ["content"] });
  const now = 1_790_000_000_000;
  const timestamp = String(now / 1000);

  it("accepts Laravel's signature (same format as RevalidateFrontend::sign)", () => {
    expect(verifySignature("s3cret", timestamp, sign("s3cret", timestamp, body), body, now)).toBe(true);
  });

  it("refuses a wrong secret, a tampered body or a stale timestamp", () => {
    expect(verifySignature("other", timestamp, sign("s3cret", timestamp, body), body, now)).toBe(false);
    expect(verifySignature("s3cret", timestamp, sign("s3cret", timestamp, body), body.replace("content", "x"), now)).toBe(false);
    expect(verifySignature("s3cret", timestamp, sign("s3cret", timestamp, body), body, now + 600_000)).toBe(false);
    expect(verifySignature("s3cret", null, null, body, now)).toBe(false);
  });
});
