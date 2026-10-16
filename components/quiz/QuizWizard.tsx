"use client";

import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type ReactNode, type RefObject } from "react";
import { Turnstile } from "@/components/forms/Turnstile";
import { Button } from "@/components/ui/Button";
import type { Link, Quiz, QuizAnswer, QuizScaleResult, QuizStep } from "@/lib/content";
import { sendQuizFeedback, submitQuiz, type QuizSubmissionResult } from "@/lib/quiz";
import { answersFor, checkStep, crisisChosen, emphasis, isSubmissionStep, toggleChoice, visibleSteps, type QuizAnswers } from "./flow";
import { ResultCard } from "./ResultCard";
import { FieldError, StepControls } from "./StepControls";

/**
 * The self-check (uptms-ad docs/QUIZ.md): a welcome card, then one step per
 * card. The steps before the first results card are sent to the clinic when
 * the visitor moves on to their results; Laravel scores them and the wizard
 * shows what it returns. The steps after the results are optional feedback,
 * sent at the end. Answers live only in this component's state — no storage,
 * no analytics — and are cleared by "Start over".
 */
interface Props {
  quiz: Quiz;
  phone: { display: string; href: string };
  /** The done card's buttons, tokens already resolved. */
  donePrimary: Link | null;
  doneSecondary: Link | null;
}

type Place = { kind: "welcome" } | { kind: "step"; key: string } | { kind: "done" };
type Sent = { reference: string | null; feedbackToken: string | null; scales: QuizScaleResult[]; crisis: boolean };
type Problem = { kind: "rate-limited"; retryAfter: number | null } | { kind: "failed"; requestId: string | null } | null;

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const UTM_KEYS = ["source", "medium", "campaign"] as const;
const CONTACT = new Set(["name", "email", "phone"]);

export function QuizWizard({ quiz, phone, donePrimary, doneSecondary }: Props) {
  const id = useId();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [place, setPlace] = useState<Place>({ kind: "welcome" });
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Sent | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [pending, startTransition] = useTransition();
  const [token, setToken] = useState("");
  const [turnstileRun, setTurnstileRun] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLFormElement>(null);
  const moved = useRef(false);
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answersRef = useRef(answers);
  // When a tap last moved the wizard on by itself: a Next tapped in the same breath must not scold the new card.
  const justMoved = useRef(false);

  const steps = visibleSteps(quiz, answers);
  const index = place.kind === "step" ? steps.findIndex((step) => step.key === place.key) : -1;
  const step = index >= 0 ? steps[index] : undefined;
  const crisis = crisisChosen(quiz, answers) || Boolean(sent?.crisis);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Each new card takes focus at its heading, so screen readers hear the question.
  useEffect(() => {
    if (moved.current) heading.current?.focus({ preventScroll: true });
    if (moved.current && card.current && card.current.getBoundingClientRect().top < 0) card.current.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [place]);

  // Leaving the page mid-advance cancels the pending move.
  useEffect(() => {
    const timer = advance;

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const clearTimer = () => {
    if (advance.current) clearTimeout(advance.current);
    advance.current = null;
  };

  /** After a check fails: the first invalid field, or the first choice of an invalid choice group. */
  const focusFirstError = () => {
    requestAnimationFrame(() => card.current?.querySelector<HTMLElement>('[aria-invalid="true"] input, [aria-invalid="true"]')?.focus());
  };

  const go = (next: Place, way: "forward" | "back") => {
    clearTimer();
    moved.current = true;
    setDirection(way);
    setErrors({});
    setProblem(null);
    setPlace(next);
  };

  const setAnswer = (key: string, value: QuizAnswer) => {
    const next = { ...answersRef.current, [key]: value };
    answersRef.current = next;
    setAnswers(next);
    setErrors((current) => Object.fromEntries(Object.entries(current).filter(([name]) => name !== key && !name.startsWith(`${key}.`))));

    return next;
  };

  const finish = (current: QuizAnswers) => {
    const feedback = answersFor(quiz, current, "feedback");

    // Best effort: the thank-you card never waits on feedback.
    if (sent?.feedbackToken && Object.keys(feedback).length > 0) {
      void sendQuizFeedback({ feedback_token: sent.feedbackToken, answers: feedback }).catch(() => undefined);
    }

    go({ kind: "done" }, "forward");
  };

  const submit = (current: QuizAnswers, from: QuizStep) => {
    if (SITE_KEY && token === "") {
      setErrors({ turnstile_token: "Please wait a moment while we check this browser, then try again." });

      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(`utm_${key}`);
      if (value) utm[key] = value.slice(0, 100);
    }

    startTransition(async () => {
      let result: QuizSubmissionResult;

      try {
        result = await submitQuiz({
          answers: answersFor(quiz, current, "submission"),
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
        const done: Sent = { reference: result.reference, feedbackToken: result.feedbackToken, scales: result.scales, crisis: result.crisis };
        setSent(done);
        const after = visibleSteps(quiz, current);
        const next = after[after.findIndex((item) => item.key === from.key) + 1];
        go(next ? { kind: "step", key: next.key } : { kind: "done" }, "forward");

        return;
      }

      // A Turnstile token is single-use: get a fresh one for the next try.
      if (SITE_KEY) {
        setToken("");
        setTurnstileRun((run) => run + 1);
      }

      if (result.status === "invalid") {
        const visible = visibleSteps(quiz, current);
        const target = visible.find((item) => Object.keys(result.errors).some((key) => key === item.key || key.startsWith(`${item.key}.`)));

        if (target && target.key !== from.key) {
          go({ kind: "step", key: target.key }, "back");
          setErrors(result.errors);
        } else {
          setErrors(result.errors);
          focusFirstError();
        }

        return;
      }

      setProblem(result.status === "rate-limited" ? { kind: "rate-limited", retryAfter: result.retryAfter } : { kind: "failed", requestId: result.requestId });
    });
  };

  const next = (current: QuizAnswers = answersRef.current) => {
    clearTimer();
    if (pending || !step) return;

    const found = checkStep(step, current[step.key]);
    if (Object.keys(found).length > 0) {
      if (current[step.key] === undefined && justMoved.current) return;
      setErrors(found);
      focusFirstError();

      return;
    }

    const visible = visibleSteps(quiz, current);
    const at = visible.findIndex((item) => item.key === step.key);
    const following = visible[at + 1];
    const endsSubmission = isSubmissionStep(quiz, step.key) && (following === undefined || !isSubmissionStep(quiz, following.key));

    if (endsSubmission && sent === null) {
      submit(current, step);

      return;
    }

    if (following) go({ kind: "step", key: following.key }, "forward");
    else finish(current);
  };

  const previous = () => {
    if (pending) return;
    const before = index > 0 ? steps[index - 1] : undefined;
    go(before ? { kind: "step", key: before.key } : { kind: "welcome" }, "back");
  };

  const restart = () => {
    answersRef.current = {};
    setAnswers({});
    setSent(null);
    setToken("");
    setTurnstileRun((run) => run + 1);
    go({ kind: "welcome" }, "back");
  };


  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    next();
  };

  const choose = (value: string, pointer: boolean) => {
    if (!step) return;
    const current = setAnswer(step.key, value);
    const choice = step.choices.find((item) => item.value === value);

    // A tap moves on by itself, like flipping a card; a crisis answer stays so the help panel is read.
    if (pointer && step.layout !== "select" && !choice?.crisis) {
      clearTimer();
      advance.current = setTimeout(() => {
        justMoved.current = true;
        setTimeout(() => (justMoved.current = false), 700);
        next(current);
      }, 350);
    }
  };

  /* ---------------------------------------------------------------- views */

  if (place.kind === "welcome") {
    return (
      <Shell label="Free self-check" progress={0} direction={direction} cardKey="welcome" formRef={card} onSubmit={(event) => {
        event.preventDefault();
        const first = steps[0];
        if (first) go({ kind: "step", key: first.key }, "forward");
      }}>
        <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6 py-10 md:px-10 md:py-14">
          <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-sky-soft text-royal">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M9 4.5h8M9 4.5a1.5 1.5 0 0 0-1.5 1.5v.5h11V6A1.5 1.5 0 0 0 17 4.5M7.5 6.5H6a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 6 23.5h14a1.5 1.5 0 0 0 1.5-1.5V8A1.5 1.5 0 0 0 20 6.5h-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M9 14.5l2.5 2.5L17 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h3 ref={heading} tabIndex={-1} className="font-serif text-[32px] leading-[1.12] tracking-[-0.015em] text-ink outline-none md:text-[40px]">
            {quiz.intro.title}
          </h3>
          {quiz.intro.body && <p className="max-w-[46ch] text-body-l text-ink-soft">{quiz.intro.body}</p>}
          <Button type="submit" className="w-full sm:w-auto sm:min-w-[220px]">
            {quiz.intro.start_label || "Start"}
            <Arrow />
          </Button>
          {quiz.intro.note && (
            <p className="flex items-center gap-2 text-body-s text-ink-soft">
              <Lock />
              {quiz.intro.note}
            </p>
          )}
        </div>
      </Shell>
    );
  }

  if (place.kind === "done" || !step) {
    return (
      <Shell label="All done" progress={100} direction={direction} cardKey="done" formRef={card} onSubmit={(event) => event.preventDefault()}>
        <div role="status" className="flex flex-1 flex-col items-start justify-center gap-5 px-6 py-10 md:px-10 md:py-14">
          <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-royal text-white">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h3 ref={heading} tabIndex={-1} className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] text-ink outline-none md:text-[36px]">
            {quiz.done.title}
          </h3>
          {quiz.done.body && <p className="max-w-[48ch] text-body-m text-ink-soft">{quiz.done.body}</p>}
          {sent?.reference && (
            <p className="text-body-s text-ink-soft">
              Your reference: <span className="font-bold text-ink">{sent.reference}</span>
            </p>
          )}
          {crisis && <CrisisPanel title={quiz.crisis.title} body={quiz.crisis.body} />}
          {(donePrimary || doneSecondary) && (
            <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              {donePrimary && <Button href={donePrimary.href}>{donePrimary.label}</Button>}
              {doneSecondary && (
                <Button href={doneSecondary.href} variant="secondary">
                  {doneSecondary.label}
                </Button>
              )}
            </div>
          )}
          <button type="button" onClick={restart} className="rounded-sm font-display text-[15px] font-bold text-royal underline-offset-4 hover:underline">
            Start over
          </button>
        </div>
      </Shell>
    );
  }

  const scale = step.scale ? quiz.scales.find((item) => item.key === step.scale) : undefined;
  const result = step.type === "results" ? sent?.scales.find((item) => item.key === step.scale) : undefined;
  const prompt = step.type === "results" ? step.prompt || scale?.title || "Your results" : step.prompt;
  const submission = isSubmissionStep(quiz, step.key);
  const following = steps[index + 1];
  const sends = submission && sent === null && (following === undefined || !isSubmissionStep(quiz, following.key));
  // Once the answers are sent, the cards before the results are closed: going back would edit what the clinic already has.
  const canGoBack = !(sent !== null && !submission && index > 0 && isSubmissionStep(quiz, steps[index - 1]!.key));
  const label = step.type === "results" ? "Your results" : CONTACT.has(step.type) ? "Your contact details" : !submission ? "Your feedback" : scale ? (scale.instrument ? `${scale.label} check · ${scale.instrument}` : `${scale.label} check`) : "Your self-check";
  const progress = Math.round(((index + 1) / steps.length) * 100);
  const showPrivacy = CONTACT.has(step.type) && quiz.privacy_note && step.help !== quiz.privacy_note;

  return (
    <Shell label={label} progress={progress} position={`Step ${index + 1} of ${steps.length}`} direction={direction} cardKey={step.key} formRef={card} onSubmit={onSubmit} busy={pending}>
      <div className="flex flex-1 flex-col gap-6 px-5 pt-7 pb-6 md:px-10 md:pt-9">
        <div className="flex flex-col gap-2">
          <h3 id={`${id}-prompt`} ref={heading} tabIndex={-1} className="font-serif text-[24px] leading-[1.25] tracking-[-0.01em] text-ink outline-none md:text-[28px]">
            {emphasis(prompt).map((part, i) => (part.strong ? <strong key={i} className="font-semibold text-navy">{part.text}</strong> : <span key={i}>{part.text}</span>))}
            {step.required && step.type !== "results" && <span className="sr-only"> (required)</span>}
          </h3>
          {step.help && step.type !== "results" && <p className="text-body-s text-ink-soft">{step.help}</p>}
        </div>

        {step.type === "results" ? (
          result ? (
            <ResultCard result={result} note={[step.help, quiz.result_disclaimer].filter(Boolean).join(" ")} />
          ) : (
            <p className="rounded-[16px] bg-sky-soft px-5 py-4 text-body-m text-ink">Your answers are with the clinic team, who will go through this result with you when they call.</p>
          )
        ) : (
          <div className="flex flex-col gap-3">
            <StepControls
              step={step}
              answer={answers[step.key]}
              errors={errors}
              idBase={id}
              onChoose={choose}
              onToggle={(value) => setAnswer(step.key, toggleChoice(step, Array.isArray(answers[step.key]) ? (answers[step.key] as string[]) : [], value))}
              onText={(value) => setAnswer(step.key, value)}
            />
            {step.type !== "name" && <FieldError idBase={id} name={step.key} errors={errors} />}
          </div>
        )}

        {crisis && (step.type === "results" || step.choices.some((choice) => choice.crisis)) && <CrisisPanel title={quiz.crisis.title} body={quiz.crisis.body} />}

        {showPrivacy && (
          <p className="flex items-center gap-2 text-body-s text-ink-soft">
            <Lock />
            {quiz.privacy_note}
          </p>
        )}

        {sends && (
          <>
            {/* Honeypot: off-screen and hidden from assistive technology; bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${id}-website`}>Website</label>
              <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            {SITE_KEY && <Turnstile siteKey={SITE_KEY} onToken={setToken} resetKey={turnstileRun} />}
            <FieldError idBase={id} name="turnstile_token" errors={errors} />
          </>
        )}

        <div role="status" aria-live="polite" className="empty:hidden">
          {problem?.kind === "failed" && (
            <Alert title="Your answers didn’t go through.">
              Nothing was sent. Please try again in a moment, or call{" "}
              <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
                {phone.display}
              </a>
              .{problem.requestId && <span className="mt-1 block text-caption">Reference for the clinic’s web team: {problem.requestId}</span>}
            </Alert>
          )}
          {problem?.kind === "rate-limited" && (
            <Alert title="Too many tries from this connection.">
              Please wait {problem.retryAfter ? `${problem.retryAfter} seconds` : "a minute"} and try again, or call{" "}
              <a href={phone.href} className="font-bold text-royal underline-offset-4 hover:underline">
                {phone.display}
              </a>
              .
            </Alert>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-stretch border-t border-line">
        {canGoBack ? (
          <button type="button" onClick={previous} disabled={pending} className="flex min-h-[64px] shrink-0 items-center gap-2 px-5 font-display text-[15px] font-bold tracking-[0.06em] text-ink-soft uppercase transition-colors hover:bg-paper hover:text-ink disabled:opacity-50 sm:flex-1 md:px-8">
            <Arrow back />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Previous</span>
          </button>
        ) : (
          <span className="sm:flex-1" />
        )}
        <button
          type="submit"
          aria-disabled={pending || undefined}
          className="flex min-h-[64px] min-w-0 flex-1 items-center justify-end gap-2 bg-royal px-5 font-display text-[15px] font-bold tracking-[0.06em] text-white uppercase transition-colors hover:bg-royal-deep md:px-8"
        >
          {pending ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            <>
              {sends ? (
                <>
                  <span className="sm:hidden">See results</span>
                  <span className="hidden sm:inline">See my results</span>
                </>
              ) : following || submission ? (
                "Next"
              ) : (
                "Finish"
              )}{" "}
              <Arrow />
            </>
          )}
        </button>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ parts */

function Shell({
  label,
  progress,
  position,
  direction,
  cardKey,
  formRef,
  onSubmit,
  busy,
  children,
}: {
  label: string;
  progress: number;
  position?: string;
  direction: "forward" | "back";
  cardKey: string;
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit: (event: FormEvent) => void;
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={busy || undefined} className="relative flex scroll-mt-28 flex-col overflow-hidden rounded-sheet bg-white shadow-[0_24px_48px_rgba(14,48,78,0.10)]">
      <div className="flex flex-col gap-3 bg-navy px-5 pt-5 pb-4 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-0 truncate font-display text-[14px] leading-[1.3] font-bold tracking-[0.04em] text-white">{label}</p>
          <p aria-live="polite" className="shrink-0 font-display text-[13px] font-bold text-sky">
            <span className="sr-only">{position ? `${position}. ` : ""}</span>
            {progress}%
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
          <div className="h-full rounded-full bg-sky transition-[width] duration-300 ease-out" style={{ width: `${Math.max(progress, 2)}%` }} />
        </div>
      </div>
      <div key={cardKey} className={`flex min-h-[460px] flex-col md:min-h-[480px] ${direction === "forward" ? "quiz-card-forward" : "quiz-card-back"}`}>
        {children}
      </div>
    </form>
  );
}

function CrisisPanel({ title, body }: { title: string; body: string }) {
  return (
    <div role="alert" className="flex w-full flex-col gap-3 rounded-[18px] border border-danger/25 bg-danger-soft px-5 py-4">
      <p className="text-body-m font-bold text-ink">{title}</p>
      {body && <p className="text-body-s text-ink">{body}</p>}
      <div className="flex flex-wrap gap-2.5">
        <a href="tel:988" className="inline-flex min-h-11 items-center rounded-full bg-danger px-5 font-display text-[15px] font-bold text-white hover:bg-danger/90">
          Call 988
        </a>
        <a href="sms:988" className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-danger px-5 font-display text-[15px] font-bold text-danger hover:bg-white">
          Text 988
        </a>
      </div>
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

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" className={back ? "rotate-180" : ""}>
      <path d="M3 9h12m-4.5-4.5L15 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lock() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-royal">
      <rect x="2.75" y="7" width="10.5" height="7" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}
