"use client";

import { useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { submitConsultation, type ConsultationResult } from "@/lib/consultation";
import { acceptsRequests, type ConsultationFormSource } from "./formSource";
import { Turnstile } from "./Turnstile";
import { validateConsultation, type ConsultationErrors, type ConsultationValues } from "./validateConsultation";

/**
 * "Find out if you qualify for TMS" form: inline on the Contact page and in
 * the Home hero's popup. Checks fields in the browser, then a server action
 * forwards the request to Laravel, which validates again and stores it
 * encrypted. Nothing is tracked, logged or kept in the browser; on success
 * the fields are cleared.
 */
export type { ConsultationFormSource };

interface Props {
  title: string;
  notice: string;
  help: string;
  submitLabel: string;
  successBody: string;
  phone: { display: string; href: string };
  form: ConsultationFormSource | null;
  /** Insurance partner names; "Other" and "No insurance" are always offered. */
  insurers: string[];
  /** "card" on a page; "bare" inside the popup, which draws its own sheet and title. */
  frame?: "card" | "bare";
  titleId?: string;
}

type Status = { kind: "idle" } | { kind: "sent"; reference: string | null } | { kind: "rate-limited"; retryAfter: number | null } | { kind: "failed"; requestId: string | null };

const EMPTY: ConsultationValues = { first_name: "", last_name: "", phone: "", email: "", insurance: "", prior_treatment: "", contact_method: "" };
const EXTRA_INSURANCE = ["Other", "No insurance"];
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const UTM_KEYS = ["source", "medium", "campaign"] as const;

const fieldClasses = (invalid: boolean) =>
  `h-[53px] w-full min-w-0 rounded-control border-[1.5px] bg-white px-[18px] text-body-m text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/20 ${
    invalid ? "border-danger" : "border-ink-soft/60"
  }`;

export function ConsultationForm({ title, notice, help, submitLabel, successBody, phone, form, insurers, frame = "card", titleId }: Props) {
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
  const insurance = [...insurers.filter((name) => !EXTRA_INSURANCE.includes(name)), ...EXTRA_INSURANCE];
  const Frame = frame === "card" ? CardFrame : BareFrame;

  if (!acceptsRequests(form)) {
    return (
      <Frame title={title} titleId={titleId}>
        <p className="rounded-[16px] bg-sky-soft px-4 py-3.5 text-body-m text-ink">
          To find out if you qualify, call the clinic at{" "}
          <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
            {phone.display}
          </a>
          .
        </p>
      </Frame>
    );
  }

  const set = (key: keyof ConsultationValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const announce = () => requestAnimationFrame(() => statusRef.current?.focus());

  const focusFirst = (found: ConsultationErrors) => {
    const first = (Object.keys(EMPTY) as (keyof ConsultationValues)[]).find((key) => found[key]);
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
    // A self-check result can link here with ?topic=…; it travels with the request.
    const wanted = params.get("topic") ?? "";
    const topic = form.topics.some((option) => option.value === wanted) ? wanted : "";
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(`utm_${key}`);
      if (value) utm[key] = value.slice(0, 100);
    }

    startTransition(async () => {
      let result: ConsultationResult;

      try {
        result = await submitConsultation({
          ...values,
          topic,
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
      <Frame title={title} titleId={titleId}>
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
      </Frame>
    );
  }

  const describe = (key: keyof ConsultationErrors) => (errors[key] ? `${id}-${key}-error` : undefined);
  const invalid = (key: keyof ConsultationErrors) => Boolean(errors[key]) || undefined;

  const error = (key: keyof ConsultationErrors) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="text-body-s font-semibold text-danger">
        {errors[key]}
      </p>
    ) : null;

  const field = (key: keyof ConsultationValues, text: string, control: ReactNode, className = "") => (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={`${id}-${key}`} className="font-display text-[15px] font-bold">
        {text}
      </label>
      {control}
      {error(key)}
    </div>
  );

  const choices = (key: keyof ConsultationValues, options: { value: string; label: string }[]) => (
    <SelectBox id={`${id}-${key}`} name={key} value={values[key]} onChange={set(key)} invalid={Boolean(errors[key])} describedBy={describe(key)}>
      <option value="" disabled>
        Please select…
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectBox>
  );

  return (
    <Frame title={title} titleId={titleId}>
      {notice && <p className="rounded-[16px] bg-sky-soft px-4 py-3.5 text-body-s text-ink">{notice}</p>}
      <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-describedby={help ? `${id}-help` : undefined} aria-busy={pending || undefined}>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
          {field(
            "first_name",
            "First Name *",
            <input id={`${id}-first_name`} name="first_name" autoComplete="given-name" required maxLength={60} value={values.first_name} onChange={set("first_name")} placeholder="Your first name" aria-invalid={invalid("first_name")} aria-describedby={describe("first_name")} className={fieldClasses(Boolean(errors.first_name))} />,
          )}
          {field(
            "last_name",
            "Last Name *",
            <input id={`${id}-last_name`} name="last_name" autoComplete="family-name" required maxLength={60} value={values.last_name} onChange={set("last_name")} placeholder="Your last name" aria-invalid={invalid("last_name")} aria-describedby={describe("last_name")} className={fieldClasses(Boolean(errors.last_name))} />,
          )}
          {field(
            "phone",
            "Phone *",
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2 text-body-m font-bold text-ink-soft">
                +1
              </span>
              <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel-national" required maxLength={30} value={values.phone} onChange={set("phone")} placeholder="(253) 555-0142" aria-invalid={invalid("phone")} aria-describedby={describe("phone")} className={`${fieldClasses(Boolean(errors.phone))} pl-12`} />
            </div>,
          )}
          {field(
            "email",
            "Email *",
            <div className="relative">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2 text-ink-soft">
                <rect x="1.75" y="3.75" width="14.5" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.5 5l6.5 4.75L15.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={190} value={values.email} onChange={set("email")} placeholder="Your best email" aria-invalid={invalid("email")} aria-describedby={describe("email")} className={`${fieldClasses(Boolean(errors.email))} pl-12`} />
            </div>,
          )}
          {field(
            "insurance",
            "Insurance Name *",
            choices(
              "insurance",
              insurance.map((name) => ({ value: name, label: name })),
            ),
            "sm:col-span-2",
          )}
          {field("prior_treatment", "Have you tried therapy and antidepressants? *", choices("prior_treatment", form.prior_treatments), "sm:col-span-2")}
          {field("contact_method", "Preferred method of communication *", choices("contact_method", form.contact_methods), "sm:col-span-2")}
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
    </Frame>
  );
}

function CardFrame({ title, titleId, children }: { title: string; titleId?: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-col gap-6 rounded-sheet border border-line bg-white p-6 shadow-[0_24px_48px_rgba(14,48,78,0.08)] md:p-10">
      {title && (
        <h3 id={titleId} className="font-serif text-[28px] leading-[1.15] tracking-[-0.015em] md:text-[32px]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function BareFrame({ title, titleId, children }: { title: string; titleId?: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-col gap-6">
      {title && (
        <h2 id={titleId} className="pr-10 font-serif text-[30px] leading-[1.12] tracking-[-0.015em] md:text-center md:text-[36px]">
          {title}
        </h2>
      )}
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
