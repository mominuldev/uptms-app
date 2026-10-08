"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { validateConsultation, type ConsultationErrors, type ConsultationValues } from "./validateConsultation";

/**
 * Consultation request form (Figma 33:430). Phase 2 is the interface only:
 * it validates in the browser and then explains that online requests open
 * soon. Nothing is sent, stored or tracked — Phase 3 wires it to Laravel.
 */
interface Props {
  title: string;
  notice: string;
  topics: string[];
  help: string;
  submitLabel: string;
  phone: { display: string; href: string };
}

const fieldClasses = (invalid: boolean) =>
  `h-[53px] w-full min-w-0 rounded-control border-[1.5px] bg-white px-[18px] text-body-m text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/20 ${
    invalid ? "border-danger" : "border-ink-soft"
  }`;

export function ConsultationForm({ title, notice, topics, help, submitLabel, phone }: Props) {
  const id = useId();
  const [values, setValues] = useState<ConsultationValues>({ name: "", phone: "", email: "", topic: topics[0] ?? "", question: "" });
  const [errors, setErrors] = useState<ConsultationErrors>({});
  const [status, setStatus] = useState<"idle" | "previewed">("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const set = (key: keyof ConsultationValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateConsultation(values);
    setErrors(found);

    const first = (Object.keys(found) as (keyof ConsultationValues)[])[0];

    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setStatus("idle");

      return;
    }

    setStatus("previewed");
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const describe = (key: keyof ConsultationValues, hint?: string) => [errors[key] ? `${id}-${key}-error` : null, hint ?? null].filter(Boolean).join(" ") || undefined;

  const error = (key: keyof ConsultationValues) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="text-body-s font-semibold text-danger">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="flex flex-col gap-6 rounded-sheet border border-line bg-white p-6 shadow-[0_24px_48px_rgba(14,48,78,0.08)] md:p-10">
      {title && <h3 className="font-serif text-[28px] leading-[1.15] tracking-[-0.015em] md:text-[32px]">{title}</h3>}
      {notice && <p className="rounded-[16px] bg-sky-soft px-4 py-3.5 text-body-s text-ink">{notice}</p>}
      <form ref={form} noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-describedby={help ? `${id}-help` : undefined}>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={`${id}-name`} className="font-display text-[15px] font-bold">
              Name *
            </label>
            <input id={`${id}-name`} name="name" autoComplete="name" required value={values.name} onChange={set("name")} placeholder="Your name" aria-invalid={Boolean(errors.name) || undefined} aria-describedby={describe("name")} className={fieldClasses(Boolean(errors.name))} />
            {error("name")}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={`${id}-phone`} className="font-display text-[15px] font-bold">
              Phone *
            </label>
            <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" required value={values.phone} onChange={set("phone")} placeholder="(253) 555-0142" aria-invalid={Boolean(errors.phone) || undefined} aria-describedby={describe("phone")} className={fieldClasses(Boolean(errors.phone))} />
            {error("phone")}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={`${id}-email`} className="font-display text-[15px] font-bold">
              Email (optional)
            </label>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} placeholder="you@example.com" aria-invalid={Boolean(errors.email) || undefined} aria-describedby={describe("email")} className={fieldClasses(Boolean(errors.email))} />
            {error("email")}
          </div>
          {topics.length > 0 && (
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor={`${id}-topic`} className="font-display text-[15px] font-bold">
                How can we help?
              </label>
              <div className="relative">
                <select id={`${id}-topic`} name="topic" value={values.topic} onChange={set("topic")} className={`${fieldClasses(false)} appearance-none pr-12`}>
                  {topics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-[18px] -translate-y-1/2 text-royal">
                  <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-question`} className="font-display text-[15px] font-bold">
            Your question (optional)
          </label>
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
        {help && (
          <p id={`${id}-help`} className="text-caption text-ink-soft">
            {help}
          </p>
        )}
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
        <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {status === "previewed" && (
            <div className="flex flex-col gap-2 rounded-[16px] border border-line bg-paper px-5 py-4">
              <p className="text-body-m font-bold">Your details look complete — online requests open soon.</p>
              <p className="text-body-s text-ink-soft">
                Nothing was sent. To reach the clinic now, call{" "}
                <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
                  {phone.display}
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
