import { createHmac, timingSafeEqual } from "node:crypto";

/** Signature check for the Laravel publish webhook (app/api/revalidate). */
const MAX_AGE_SECONDS = 300;

export function verifySignature(secret: string, timestamp: string | null, signature: string | null, body: string, now = Date.now()): boolean {
  if (!timestamp || !signature || !/^\d+$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > MAX_AGE_SECONDS) {
    return false;
  }

  const expected = Buffer.from(createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex"));
  const given = Buffer.from(signature);

  return expected.length === given.length && timingSafeEqual(expected, given);
}
