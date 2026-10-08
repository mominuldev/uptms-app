"use client";

import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { submitConsultation, type ConsultationResult } from "@/lib/consultation";
import { Turnstile } from "./Turnstile";
import { validateConsultation, type ConsultationErrors, type ConsultationValues } from "./validateConsultation";

/**
 * Consultation request form (Figma 33:430). Checks fields in the browser,
 * then a server action forwards the request to Laravel, which validates
 * again and stores it encrypted. Nothing is tracked, logged or kept in the
 * browser; on success the fields are cleared.
 */
export interface ConsultationFormSource {
  accepting: boolean;
  topics: { value: string; label: string }[];
  best_times: { value: string; label: string }[];
}

interface Props {
  title: string;
  notice: string;
  help: string;
  submitLabel: string;
  successBody: string;
  phone: { display: string; href: string };
  form: ConsultationFormSource | null;
}

type Status = { kind: "idle" } | { kind: "sent"; reference: string | null } | { kind: "rate-limited"; retryAfter: number | null } | { kind: "failed"; requestId: string | null };

const EMPTY: ConsultationValues = { name: "", phone: "", email: "", topic: "", best_time: "", referred_by: "", question: "" };
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const UTM_KEYS = ["source", "medium", "campaign"] as const;

const fieldClasses = (invalid: boolean) =>
  `h-[53px] w-full min-w-0 rounded-control border-[1.5px] bg-white px-[18px] text-body-m text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/20 ${
    invalid ? "border-danger" : "border-ink-soft"
  }`;

export function ConsultationForm({ title, notice, help, submitLabel, successBody, phone, form }: Props) {
  const id = useId();
  const [values, setValues] = useState<ConsultationValues>(EMPTY);
  const [errors, setErrors] = useState<ConsultationErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [token, setToken] = useState("");
  const [turnstileRun, setTurnstileRun] = useState(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const topics = form?.topics ?? [];

  // A self-check result can link here with ?topic=…; pre-select it once.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("topic");

    if (wanted && topics.some((topic) => topic.value === wanted)) {
      setValues((current) => (current.topic === "" ? { ...current, topic: wanted } : current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read the URL once on arrival
  }, []);

  if (!form?.accepting) {
    return (
      <FormFrame title={title}>
        <p className="rounded-[16px] bg-sky-soft px-4 py-3.5 text-body-m text-ink">
          To request a consultation, call the clinic at{" "}
          <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
            {phone.display}
          </a>
          .
        </p>
      </FormFrame>
    );
  }

  const set = (key: keyof ConsultationValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const announce = () => requestAnimationFrame(() => statusRef.current?.focus());

  const focusFirst = (found: ConsultationErrors) => {
    const first = (Object.keys(found) as (keyof ConsultationErrors)[]).find((key) => found[key]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;

    const found = validateConsultation(values);
    setErrors(found);

    if (Object.values(found).some(Boolean)) {
      setStatus({ kind: "idle" });
      focusFirst(found);

      return;
    }

    if (SITE_KEY && token === "") {
      setErrors({ turnstile_token: "Please wait a moment while we check this browser, then send again." });

      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(`utm_${key}`);
      if (value) utm[key] = value.slice(0, 100);
    }

    startTransition(async () => {
      let result: ConsultationResult;

      try {
        result = await submitConsultation({
          name: values.name,
          phone: values.phone,
          email: values.email,
          topic: values.topic,
          best_time: values.best_time,
          referred_by: values.topic === "provider_referral" ? values.referred_by : "",
          message: values.question,
          website: honeypot.current?.value ?? "",
          source_page: window.location.pathname,
          referrer: document.referrer,
          utm,
          turnstile_token: token,
        });
      } catch {
        result = { status: "failed", requestId: null };
      }

      if (result.status === "sent") {
        setValues(EMPTY);
        setStatus({ kind: "sent", reference: result.reference });
        announce();

        return;
      }

      // A Turnstile token is single-use: get a fresh one for the next try.
      if (SITE_KEY) {
        setToken("");
        setTurnstileRun((run) => run + 1);
      }

      if (result.status === "invalid") {
        setErrors(result.errors);
        setStatus({ kind: "idle" });
        focusFirst(result.errors);

        return;
      }

      setStatus(result.status === "rate-limited" ? { kind: "rate-limited", retryAfter: result.retryAfter } : { kind: "failed", requestId: result.requestId });
      announce();
    });
  };

  if (status.kind === "sent") {
    return (
      <FormFrame title={title}>
        <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-4 rounded-[20px] bg-sky-soft px-6 py-7 outline-none">
          <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-royal text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="font-serif text-[26px] leading-[1.2] tracking-[-0.01em] text-ink">Thank you — your request is in.</p>
          <p className="text-body-m text-ink">{successBody}</p>
          {status.reference && (
            <p className="text-body-s text-ink-soft">
              Your reference: <span className="font-bold text-ink">{status.reference}</span>
            </p>
          )}
          <button type="button" onClick={() => setStatus({ kind: "idle" })} className="text-body-s font-bold text-royal underline-offset-4 hover:underline">
            Send another request
          </button>
        </div>
      </FormFrame>
    );
  }

  const describe = (key: keyof ConsultationErrors) => (errors[key] ? `${id}-${key}-error` : undefined);

  const error = (key: keyof ConsultationErrors) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="text-body-s font-semibold text-danger">
        {errors[key]}
      </p>
    ) : null;

  const label = (key: string, text: string) => (
    <label htmlFor={`${id}-${key}`} className="font-display text-[15px] font-bold">
      {text}
    </label>
  );

  const referral = values.topic === "provider_referral";

  return (
    <FormFrame title={title}>
      {notice && <p className="rounded-[16px] bg-sky-soft px-4 py-3.5 text-body-s text-ink">{notice}</p>}
      <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-describedby={help ? `${id}-help` : undefined} aria-busy={pending || undefined}>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            {label("name", "Name *")}
            <input id={`${id}-name`} name="name" autoComplete="name" required maxLength={120} value={values.name} onChange={set("name")} placeholder="Your name" aria-invalid={Boolean(errors.name) || undefined} aria-describedby={describe("name")} className={fieldClasses(Boolean(errors.name))} />
            {error("name")}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            {label("phone", "Phone *")}
            <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" required maxLength={30} value={values.phone} onChange={set("phone")} placeholder="(253) 555-0142" aria-invalid={Boolean(errors.phone) || undefined} aria-describedby={describe("phone")} className={fieldClasses(Boolean(errors.phone))} />
            {error("phone")}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            {label("email", "Email (optional)")}
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={190} value={values.email} onChange={set("email")} placeholder="you@example.com" aria-invalid={Boolean(errors.email) || undefined} aria-describedby={describe("email")} className={fieldClasses(Boolean(errors.email))} />
            {error("email")}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            {label("topic", "How can we help? *")}
            <SelectBox id={`${id}-topic`} name="topic" value={values.topic} onChange={set("topic")} invalid={Boolean(errors.topic)} describedBy={describe("topic")}>
              <option value="" disabled>
                Choose a topic
              </option>
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </SelectBox>
            {error("topic")}
          </div>
          <div className={`flex min-w-0 flex-col gap-2 ${referral ? "" : "sm:col-span-2"}`}>
            {label("best_time", "Best time to call (optional)")}
            <SelectBox id={`${id}-best_time`} name="best_time" value={values.best_time} onChange={set("best_time")} invalid={false} describedBy={undefined}>
              <option value="">Any time</option>
              {form.best_times
                .filter((time) => time.value !== "anytime")
                .map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
            </SelectBox>
          </div>
          {referral && (
            <div className="flex min-w-0 flex-col gap-2">
              {label("referred_by", "Referring provider (optional)")}
              <input id={`${id}-referred_by`} name="referred_by" maxLength={160} value={values.referred_by} onChange={set("referred_by")} placeholder="Name and practice" aria-invalid={Boolean(errors.referred_by) || undefined} aria-describedby={describe("referred_by")} className={fieldClasses(Boolean(errors.referred_by))} />
              {error("referred_by")}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {label("question", "Your question (optional)")}
          <textarea
            id={`${id}-question`}
            name="question"
            rows={4}
            maxLength={1000}
            value={values.question}
            onChange={set("question")}
            placeholder="Keep your question general. Please do not include medical records or sensitive details."
            aria-invalid={Boolean(errors.question) || undefined}
            aria-describedby={describe("question")}
            className={`${fieldClasses(Boolean(errors.question))} h-auto min-h-[120px] resize-y py-3.5`}
          />
          {error("question")}
        </div>
        {/* Honeypot: off-screen and hidden from assistive technology; bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        {SITE_KEY && (
          <div className="flex flex-col gap-2">
            <Turnstile siteKey={SITE_KEY} onToken={setToken} resetKey={turnstileRun} />
            {error("turnstile_token")}
          </div>
        )}
        {help && (
          <p id={`${id}-help`} className="text-caption text-ink-soft">
            {help}
          </p>
        )}
        <Button type="submit" className="w-full" aria-disabled={pending || undefined}>
          {pending ? "Sending…" : submitLabel}
        </Button>
        <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {status.kind === "failed" && (
            <Alert title="Your request didn’t go through.">
              Nothing was sent. Please try again in a moment, or call{" "}
              <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
                {phone.display}
              </a>
              .{status.requestId && <span className="mt-1 block text-caption">Reference for the clinic’s web team: {status.requestId}</span>}
            </Alert>
          )}
          {status.kind === "rate-limited" && (
            <Alert title="Too many requests from this connection.">
              Please wait {status.retryAfter ? `${status.retryAfter} seconds` : "a minute"} and try again, or call{" "}
              <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
                {phone.display}
              </a>
              .
            </Alert>
          )}
        </div>
      </form>
    </FormFrame>
  );
}

function FormFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-col gap-6 rounded-sheet border border-line bg-white p-6 shadow-[0_24px_48px_rgba(14,48,78,0.08)] md:p-10">
      {title && <h3 className="font-serif text-[28px] leading-[1.15] tracking-[-0.015em] md:text-[32px]">{title}</h3>}
      {children}
    </div>
  );
}

function Alert({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[16px] border border-danger/30 bg-danger/5 px-5 py-4">
      <p className="text-body-m font-bold text-ink">{title}</p>
      <p className="text-body-s text-ink-soft">{children}</p>
    </div>
  );
}

function SelectBox({ id, name, value, onChange, invalid, describedBy, children }: { id: string; name: string; value: string; onChange: (event: { target: { value: string } }) => void; invalid: boolean; describedBy: string | undefined; children: ReactNode }) {
  return (
    <div className="relative">
      <select id={id} name={name} value={value} onChange={onChange} aria-invalid={invalid || undefined} aria-describedby={describedBy} className={`${fieldClasses(invalid)} appearance-none pr-12 ${value === "" ? "text-ink-soft/80" : ""}`}>
        {children}
      </select>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-[18px] -translate-y-1/2 text-royal">
        <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
