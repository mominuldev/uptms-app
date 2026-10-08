"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { scoreQuiz } from "./score";

/**
 * The self-check card (Figma 34:458): three questions, then a suggested
 * next step. Answers live only in this component's state — no storage, no
 * network, no analytics — as the page promises.
 */
export interface SelfCheckLink {
  label: string;
  href: string;
}

export interface SelfCheckResult {
  when: { question: string; value: string }[];
  is_default: boolean;
  title: string;
  body: string;
  primary: SelfCheckLink | null;
  secondary: SelfCheckLink | null;
}

export interface SelfCheckProps {
  headerLabel: string;
  submitLabel: string;
  privacyNote: string;
  resultEyebrow: string;
  resultDisclaimer: string;
  questions: { key: string; prompt: string; layout: "stack" | "grid"; choices: { label: string; value: string }[] }[];
  results: SelfCheckResult[];
}

export function SelfCheck({ headerLabel, submitLabel, privacyNote, resultEyebrow, resultDisclaimer, questions, results }: SelfCheckProps) {
  const id = useId();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SelfCheckResult | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const firstChoice = useRef<HTMLInputElement>(null);
  const answered = questions.filter((question) => answers[question.key] !== undefined).length;
  const complete = answered === questions.length;

  const choose = (key: string, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const submit = () => {
    if (!complete) return;
    setResult(scoreQuiz(results, answers));
    requestAnimationFrame(() => resultHeading.current?.focus());
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    requestAnimationFrame(() => firstChoice.current?.focus());
  };

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <form
        className="overflow-hidden rounded-sheet bg-white"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-6 py-5 md:px-8">
          <p className="font-display text-[15px] leading-[1.3] font-bold text-white">{headerLabel}</p>
          <p aria-live="polite" className="rounded-full bg-royal px-3.5 py-1.5 font-display text-[13px] leading-none font-bold text-white">
            {answered} of {questions.length} answered
          </p>
        </div>
        <div className="flex flex-col gap-8 px-5 py-7 md:px-8 md:py-9">
          {questions.map((question, index) => (
            <fieldset key={question.key} className="flex min-w-0 flex-col gap-3.5">
              <legend className="mb-3.5 font-serif text-[21px] leading-[1.3] md:text-[23px]">
                {index + 1}. {question.prompt}
              </legend>
              <div className={question.layout === "grid" ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-3"}>
                {question.choices.map((choice, choiceIndex) => {
                  const checked = answers[question.key] === choice.value;
                  const inputId = `${id}-${question.key}-${choice.value}`;

                  return (
                    <label
                      key={choice.value}
                      htmlFor={inputId}
                      className={`flex min-h-[62px] cursor-pointer items-center gap-3.5 rounded-control border-[1.5px] px-5 py-3.5 text-body-m transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-royal ${
                        checked ? "border-royal bg-sky-soft" : "border-ink-soft bg-white hover:border-royal"
                      }`}
                    >
                      <input
                        ref={index === 0 && choiceIndex === 0 ? firstChoice : undefined}
                        id={inputId}
                        type="radio"
                        name={`${id}-${question.key}`}
                        value={choice.value}
                        checked={checked}
                        onChange={() => choose(question.key, choice.value)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-royal" : "border-ink-soft"}`}
                      >
                        {checked && <span className="size-2.5 rounded-full bg-royal" />}
                      </span>
                      <span className="min-w-0">{choice.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button type="submit" disabled={!complete} aria-disabled={!complete} className="w-full shrink-0 sm:w-auto">
              {submitLabel}
            </Button>
            <p className="text-caption text-ink-soft">{privacyNote}</p>
          </div>
        </div>
      </form>

      <div aria-live="polite">
        {result && (
          <section aria-labelledby={`${id}-result`} className="flex flex-col gap-4 rounded-sheet bg-navy px-6 py-8 text-white md:px-9 md:py-10">
            <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-white/80 uppercase">{resultEyebrow}</p>
            <h2 id={`${id}-result`} ref={resultHeading} tabIndex={-1} className="font-serif text-[28px] leading-[1.15] tracking-[-0.015em] outline-none md:text-[32px]">
              {result.title}
            </h2>
            <p className="text-body-m text-white/86">{result.body}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {result.primary && (
                <Button href={result.primary.href} variant="light">
                  {result.primary.label}
                </Button>
              )}
              {result.secondary && (
                <Button href={result.secondary.href} variant="outlineLight">
                  {result.secondary.label}
                </Button>
              )}
            </div>
            {resultDisclaimer && <p className="text-caption text-white/72">{resultDisclaimer}</p>}
            <button type="button" onClick={reset} className="self-start rounded-sm font-display text-[15px] font-bold text-sky underline-offset-4 hover:text-white hover:underline">
              Start over
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
