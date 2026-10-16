"use server";

import { apiUrl } from "./api";
import { visitorHeaders } from "./visitor";

/**
 * The qualification form's server action (Contact page and the Home hero's popup). The browser never talks to Laravel:
 * this forwards the request server-side to POST /public/consultation-requests,
 * where Laravel validates again and stores it encrypted. With SITE_TOKEN set
 * (= FRONTEND_SITE_TOKEN in uptms-ad) the visitor's IP and user agent are
 * forwarded so Laravel's rate limit and Turnstile check apply per visitor.
 * Nothing the person typed is logged here.
 */
export interface ConsultationInput {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  insurance: string;
  prior_treatment: string;
  contact_method: string;
  /** From a self-check link (?topic=…); "" lets Laravel file it under TMS for depression. */
  topic: string;
  website: string;
  source_page: string;
  referrer: string;
  utm: Record<string, string>;
  turnstile_token: string;
}

export type ConsultationResult =
  | { status: "sent"; reference: string | null }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "rate-limited"; retryAfter: number | null }
  | { status: "failed"; requestId: string | null };

const FIELDS = ["first_name", "last_name", "phone", "email", "insurance", "prior_treatment", "contact_method", "turnstile_token"] as const;

export async function submitConsultation(input: ConsultationInput): Promise<ConsultationResult> {
  const forwarded = await visitorHeaders();

  const body = {
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    insurance: input.insurance,
    prior_treatment: input.prior_treatment,
    contact_method: input.contact_method,
    topic: input.topic || null,
    website: input.website,
    source_page: input.source_page.startsWith("/") ? input.source_page.slice(0, 190) : null,
    referrer: input.referrer.slice(0, 2000) || null,
    utm: Object.keys(input.utm).length > 0 ? input.utm : null,
    turnstile_token: input.turnstile_token || null,
  };

  let response: Response;

  try {
    response = await fetch(apiUrl("public/consultation-requests"), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", ...forwarded },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return { status: "failed", requestId: null };
  }

  const payload = (await response.json().catch(() => null)) as {
    data?: { reference?: string | null };
    errors?: Record<string, string[]>;
    meta?: { request_id?: string; retry_after?: number };
  } | null;

  if (response.status === 201) {
    return { status: "sent", reference: payload?.data?.reference ?? null };
  }

  if (response.status === 422 && payload?.errors) {
    const errors: Record<string, string> = {};

    for (const field of FIELDS) {
      const message = payload.errors[field]?.[0];
      if (message) errors[field] = message;
    }

    if (Object.keys(errors).length > 0) return { status: "invalid", errors };
  }

  if (response.status === 429) {
    const retry = Number(payload?.meta?.retry_after ?? response.headers.get("Retry-After"));

    return { status: "rate-limited", retryAfter: Number.isFinite(retry) && retry > 0 ? retry : null };
  }

  return { status: "failed", requestId: payload?.meta?.request_id ?? response.headers.get("X-Request-Id") };
}
