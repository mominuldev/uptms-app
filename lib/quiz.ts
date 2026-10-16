"use server";

import { apiUrl } from "./api";
import type { QuizAnswer, QuizScaleResult } from "./content";
import { visitorHeaders } from "./visitor";

/**
 * The self-check's server actions. The browser never talks to Laravel: the
 * answers are forwarded server-side to POST /public/quiz-submissions, where
 * Laravel checks them against the published quiz, scores them, and files
 * them (encrypted) in the consultation inbox. Nothing is logged here.
 */
export interface QuizSubmissionInput {
  answers: Record<string, QuizAnswer>;
  website: string;
  source_page: string;
  referrer: string;
  utm: Record<string, string>;
  turnstile_token: string;
}

export type QuizSubmissionResult =
  | { status: "sent"; reference: string | null; feedbackToken: string | null; scales: QuizScaleResult[]; crisis: boolean }
  /** Keys are step keys, or `<key>.first` / `<key>.last` for the name step; `turnstile_token` for the spam check. */
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "rate-limited"; retryAfter: number | null }
  | { status: "failed"; requestId: string | null };

interface Payload {
  data?: { reference?: string | null; feedback_token?: string | null; scales?: QuizScaleResult[]; crisis?: boolean };
  errors?: Record<string, string[]>;
  meta?: { request_id?: string; retry_after?: number };
}

async function post(path: string, body: unknown): Promise<{ response: Response; payload: Payload | null } | null> {
  try {
    const response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", ...(await visitorHeaders()) },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return { response, payload: (await response.json().catch(() => null)) as Payload | null };
  } catch {
    return null;
  }
}

/** `answers.name.first` → `name.first`; `turnstile_token` stays. Anything else is not shown on a card. */
function stepErrors(errors: Record<string, string[]>): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [key, messages] of Object.entries(errors)) {
    const message = messages[0];
    if (!message) continue;
    if (key.startsWith("answers.")) out[key.slice("answers.".length)] = message;
    else if (key === "turnstile_token") out[key] = message;
  }

  return out;
}

export async function submitQuiz(input: QuizSubmissionInput): Promise<QuizSubmissionResult> {
  const result = await post("public/quiz-submissions", {
    answers: input.answers,
    website: input.website,
    source_page: input.source_page.startsWith("/") ? input.source_page.slice(0, 190) : null,
    referrer: input.referrer.slice(0, 2000) || null,
    utm: Object.keys(input.utm).length > 0 ? input.utm : null,
    turnstile_token: input.turnstile_token || null,
  });

  if (result === null) return { status: "failed", requestId: null };
  const { response, payload } = result;

  if (response.status === 201) {
    return {
      status: "sent",
      reference: payload?.data?.reference ?? null,
      feedbackToken: payload?.data?.feedback_token ?? null,
      scales: payload?.data?.scales ?? [],
      crisis: payload?.data?.crisis ?? false,
    };
  }

  if (response.status === 422 && payload?.errors) {
    const errors = stepErrors(payload.errors);
    if (Object.keys(errors).length > 0) return { status: "invalid", errors };
  }

  if (response.status === 429) {
    const retry = Number(payload?.meta?.retry_after ?? response.headers.get("Retry-After"));

    return { status: "rate-limited", retryAfter: Number.isFinite(retry) && retry > 0 ? retry : null };
  }

  return { status: "failed", requestId: payload?.meta?.request_id ?? response.headers.get("X-Request-Id") };
}

/** The answers to the steps after the results. Best effort: the visitor sees the thank-you card either way. */
export async function sendQuizFeedback(input: { feedback_token: string; answers: Record<string, QuizAnswer> }): Promise<{ status: "sent" | "failed" }> {
  const result = await post("public/quiz-submissions/feedback", { feedback_token: input.feedback_token, answers: input.answers });

  return { status: result?.response.ok ? "sent" : "failed" };
}
