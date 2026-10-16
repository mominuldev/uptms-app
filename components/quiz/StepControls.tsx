"use client";

import { useRef } from "react";
import type { QuizAnswer, QuizStep } from "@/lib/content";
import { valuesOf } from "./flow";

/**
 * The answer area of one self-check card: choice cards (radio or checkbox),
 * big Yes/No buttons, a dropdown, the name pair, email, phone or a long
 * answer. Errors are keyed by step key (`<key>.first` / `.last` for names).
 */
interface Props {
  step: QuizStep;
  answer: QuizAnswer | undefined;
  errors: Record<string, string>;
  idBase: string;
  /** `pointer` is true when a mouse or finger picked it: only then may the card move on by itself. */
  onChoose: (value: string, pointer: boolean) => void;
  onToggle: (value: string) => void;
  onText: (value: QuizAnswer) => void;
}

export const fieldClasses = (invalid: boolean) =>
  `h-[56px] w-full min-w-0 rounded-control border-[1.5px] bg-white px-[18px] text-body-m text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/20 ${
    invalid ? "border-danger" : "border-ink-soft/50"
  }`;

export function errorId(idBase: string, key: string): string {
  return `${idBase}-${key.replace(/\./g, "-")}-error`;
}

export function FieldError({ idBase, name, errors }: { idBase: string; name: string; errors: Record<string, string> }) {
  return errors[name] ? (
    <p id={errorId(idBase, name)} className="text-body-s font-semibold text-danger">
      {errors[name]}
    </p>
  ) : null;
}

export function StepControls({ step, answer, errors, idBase, onChoose, onToggle, onText }: Props) {
  // Set on pointerup of a choice and read by the change that follows: arrow keys never auto-advance.
  const pointerPick = useRef(false);
  const invalid = Boolean(errors[step.key]);
  const describedBy = invalid ? errorId(idBase, step.key) : undefined;

  if (step.type === "single" && step.layout === "select") {
    const value = typeof answer === "string" ? answer : "";

    return (
      <div className="relative">
        <select
          id={`${idBase}-${step.key}`}
          name={step.key}
          value={value}
          onChange={(event) => onChoose(event.target.value, false)}
          aria-labelledby={`${idBase}-prompt`}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`${fieldClasses(invalid)} appearance-none pr-12 ${value === "" ? "text-ink-soft/80" : ""}`}
        >
          <option value="" disabled>
            Please select…
          </option>
          {step.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-[18px] -translate-y-1/2 text-royal">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (step.type === "single" || step.type === "multi") {
    const multi = step.type === "multi";
    const chosen = valuesOf(answer);
    const buttons = !multi && step.layout === "buttons";
    const layout = buttons ? "grid grid-cols-2 gap-3" : step.layout === "grid" ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-3";

    return (
      <div role={multi ? "group" : "radiogroup"} aria-labelledby={`${idBase}-prompt`} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={layout}>
        {step.choices.map((choice) => {
          const checked = chosen.includes(choice.value);
          const inputId = `${idBase}-${step.key}-${choice.value}`;

          return (
            <label
              key={choice.value}
              htmlFor={inputId}
              data-choice={choice.value}
              onPointerUp={() => {
                if (!multi) pointerPick.current = true;
              }}
              className={`group flex min-w-0 cursor-pointer items-center rounded-control border-[1.5px] text-body-m transition-[border-color,background-color,box-shadow] duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-royal ${
                buttons ? "min-h-[64px] justify-center px-4 py-3 text-center font-display text-[17px] font-bold" : "min-h-[58px] gap-3.5 px-5 py-3"
              } ${checked ? "border-royal bg-sky-soft shadow-[0_0_0_1px_var(--color-royal)]" : "border-ink-soft/40 bg-white hover:border-royal hover:bg-sky-soft/50"} ${buttons && checked ? "text-royal" : ""}`}
            >
              <input
                id={inputId}
                type={multi ? "checkbox" : "radio"}
                name={`${idBase}-${step.key}`}
                value={choice.value}
                checked={checked}
                onChange={() => {
                  if (multi) {
                    onToggle(choice.value);
                  } else {
                    const pointer = pointerPick.current;
                    pointerPick.current = false;
                    onChoose(choice.value, pointer);
                  }
                }}
                className="sr-only"
              />
              {!buttons && (
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center border-2 transition-colors ${multi ? "rounded-[6px]" : "rounded-full"} ${checked ? "border-royal bg-royal" : "border-ink-soft/60 bg-white group-hover:border-royal"}`}
                >
                  {checked &&
                    (multi ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="size-2 rounded-full bg-white" />
                    ))}
                </span>
              )}
              <span className="min-w-0 break-words">{choice.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (step.type === "name") {
    const name = typeof answer === "object" && !Array.isArray(answer) ? answer : { first: "", last: "" };
    const part = (key: "first" | "last", label: string, autoComplete: string) => {
      const field = `${step.key}.${key}`;

      return (
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor={`${idBase}-${step.key}-${key}`} className="font-display text-[15px] font-bold">
            {label}
          </label>
          <input
            id={`${idBase}-${step.key}-${key}`}
            name={field}
            autoComplete={autoComplete}
            maxLength={60}
            value={name[key]}
            onChange={(event) => onText({ ...name, [key]: event.target.value })}
            aria-invalid={Boolean(errors[field]) || undefined}
            aria-describedby={errors[field] ? errorId(idBase, field) : undefined}
            className={fieldClasses(Boolean(errors[field]))}
          />
          <FieldError idBase={idBase} name={field} errors={errors} />
        </div>
      );
    };

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {part("first", "First name", "given-name")}
        {part("last", "Last name", "family-name")}
      </div>
    );
  }

  const text = typeof answer === "string" ? answer : "";
  const common = {
    id: `${idBase}-${step.key}`,
    name: step.key,
    value: text,
    "aria-labelledby": `${idBase}-prompt`,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
  };

  if (step.type === "text") {
    return <textarea {...common} rows={5} maxLength={1000} placeholder="Type here…" onChange={(event) => onText(event.target.value)} className={`${fieldClasses(invalid)} h-auto min-h-[150px] resize-y py-4`} />;
  }

  if (step.type === "phone") {
    return (
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2 text-body-m font-bold text-ink-soft">
          +1
        </span>
        <input {...common} type="tel" autoComplete="tel-national" maxLength={30} placeholder="(253) 555-0142" onChange={(event) => onText(event.target.value)} className={`${fieldClasses(invalid)} pl-12`} />
      </div>
    );
  }

  if (step.type === "email") {
    return (
      <div className="relative">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2 text-ink-soft">
          <rect x="1.75" y="3.75" width="14.5" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2.5 5l6.5 4.75L15.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input {...common} type="email" autoComplete="email" maxLength={190} placeholder="you@example.com" onChange={(event) => onText(event.target.value)} className={`${fieldClasses(invalid)} pl-12`} />
      </div>
    );
  }

  return null;
}
