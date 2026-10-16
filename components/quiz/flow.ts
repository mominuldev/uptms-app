import type { Quiz, QuizAnswer, QuizCondition, QuizStep } from "@/lib/content";

/**
 * The self-check's branching, mirrored from uptms-ad QuizFlow (docs/QUIZ.md
 * "Visibility"). Pure functions: the wizard keeps answers in state and asks
 * these which cards to show. Scores are never computed here — Laravel scores
 * the published quiz and the wizard shows what it returns.
 */
export type QuizAnswers = Record<string, QuizAnswer | undefined>;

/** An answer as a list of choice values: single → one, multi → its values, anything else → none. */
export function valuesOf(answer: QuizAnswer | undefined): string[] {
  if (typeof answer === "string") return answer === "" ? [] : [answer];
  if (Array.isArray(answer)) return answer;

  return [];
}

function holds(condition: QuizCondition, answers: QuizAnswers): boolean {
  const chosen = valuesOf(answers[condition.step]);
  const shared = chosen.some((value) => condition.values.includes(value));

  return condition.op === "in" ? shared : !shared;
}

/**
 * The steps to show, in order. A hidden step's answer is ignored by every
 * later condition; a results step shows only when its scale was taken (at
 * least one of the scale's scored steps is visible).
 */
export function visibleSteps(quiz: Pick<Quiz, "steps">, answers: QuizAnswers): QuizStep[] {
  const seen: QuizAnswers = {};
  const visible = new Set<string>();

  for (const step of quiz.steps) {
    if (step.type === "results") continue;

    if (step.show_if.every((condition) => holds(condition, seen))) {
      visible.add(step.key);
      seen[step.key] = answers[step.key];
    }
  }

  const taken = new Set(quiz.steps.filter((step) => step.type === "single" && step.scale && visible.has(step.key)).map((step) => step.scale as string));

  return quiz.steps.filter((step) => (step.type === "results" ? step.scale !== null && taken.has(step.scale) && step.show_if.every((condition) => holds(condition, seen)) : visible.has(step.key)));
}

/** Index in `quiz.steps` of the first results step, or -1. Steps before it are the submission, steps after it are feedback. */
export function firstResultsIndex(quiz: Pick<Quiz, "steps">): number {
  return quiz.steps.findIndex((step) => step.type === "results");
}

export function isSubmissionStep(quiz: Pick<Quiz, "steps">, key: string): boolean {
  const split = firstResultsIndex(quiz);
  const at = quiz.steps.findIndex((step) => step.key === key);

  return at !== -1 && (split === -1 || at < split);
}

/** The answers to send: visible, answered steps of one part of the quiz (results steps carry none). */
export function answersFor(quiz: Pick<Quiz, "steps">, answers: QuizAnswers, part: "submission" | "feedback"): Record<string, QuizAnswer> {
  const out: Record<string, QuizAnswer> = {};

  for (const step of visibleSteps(quiz, answers)) {
    if (step.type === "results" || isSubmissionStep(quiz, step.key) !== (part === "submission")) continue;
    const answer = answers[step.key];
    if (answer === undefined || isBlank(answer)) continue;
    out[step.key] = typeof answer === "string" ? answer.trim() : typeof answer === "object" && !Array.isArray(answer) ? { first: answer.first.trim(), last: answer.last.trim() } : answer;
  }

  return out;
}

function isBlank(answer: QuizAnswer): boolean {
  if (typeof answer === "string") return answer.trim() === "";
  if (Array.isArray(answer)) return answer.length === 0;

  return answer.first.trim() === "" && answer.last.trim() === "";
}

/** Multi choices: an exclusive choice clears the others, any other choice clears the exclusive ones. */
export function toggleChoice(step: QuizStep, current: string[], value: string): string[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  const exclusive = new Set(step.choices.filter((choice) => choice.exclusive).map((choice) => choice.value));

  return exclusive.has(value) ? [value] : [...current.filter((item) => !exclusive.has(item)), value];
}

/** A visible single step answered with a crisis choice. */
export function crisisChosen(quiz: Pick<Quiz, "steps">, answers: QuizAnswers): boolean {
  return visibleSteps(quiz, answers).some((step) => step.type === "single" && step.choices.some((choice) => choice.crisis && answers[step.key] === choice.value));
}

const PHONE = /^[0-9 ()+.\-]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Instant checks for one card, worded like Laravel's (which validates again
 * and wins). Keys: the step key, or `<key>.first` / `<key>.last` for names.
 */
export function checkStep(step: QuizStep, answer: QuizAnswer | undefined): Record<string, string> {
  const errors: Record<string, string> = {};
  const text = typeof answer === "string" ? answer.trim() : "";
  const required = step.required || step.type === "name" || step.type === "phone";

  switch (step.type) {
    case "name": {
      const name = typeof answer === "object" && !Array.isArray(answer) ? answer : { first: "", last: "" };
      if (name.first.trim() === "") errors[`${step.key}.first`] = "Enter your first name so the team knows who to ask for.";
      else if (name.first.trim().length > 60) errors[`${step.key}.first`] = "Keep your first name under 60 characters.";
      if (name.last.trim() === "") errors[`${step.key}.last`] = "Enter your last name.";
      else if (name.last.trim().length > 60) errors[`${step.key}.last`] = "Keep your last name under 60 characters.";
      break;
    }
    case "phone": {
      const digits = text.replace(/\D/g, "");
      if (text === "") errors[step.key] = "Enter a phone number the clinic can call.";
      else if (digits.length < 10 || digits.length > 11 || (digits.length === 11 && !digits.startsWith("1")) || !PHONE.test(text)) errors[step.key] = "Enter a 10-digit U.S. phone number, e.g. (253) 555-0142.";
      break;
    }
    case "email":
      if (text === "") {
        if (required) errors[step.key] = "Enter an email address the clinic can reply to.";
      } else if (!EMAIL.test(text) || text.length > 190) errors[step.key] = "Enter a valid email address, e.g. you@example.com.";
      break;
    case "text":
      if (required && text === "") errors[step.key] = "Please write a short answer to continue.";
      else if (text.length > 1000) errors[step.key] = "Keep your answer under 1,000 characters.";
      break;
    case "multi":
      if (required && valuesOf(answer).length === 0) errors[step.key] = "Choose at least one answer to continue.";
      break;
    case "single":
      if (required && valuesOf(answer).length === 0) errors[step.key] = step.layout === "select" ? "Choose an answer from the list to continue." : "Choose an answer to continue.";
      break;
    case "results":
      break;
  }

  return errors;
}

/** `*word*` → emphasised segments, for prompts like "the *most* challenging". */
export function emphasis(text: string): { text: string; strong: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter((part) => part !== "")
    .map((part) => (part.length > 2 && part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), strong: true } : { text: part, strong: false }));
}
