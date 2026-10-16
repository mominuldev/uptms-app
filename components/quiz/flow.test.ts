import { describe, expect, it } from "vitest";
import type { QuizStep } from "@/lib/content";
import { quizFixture } from "@/test/quiz-fixture";
import { answersFor, checkStep, crisisChosen, emphasis, isSubmissionStep, toggleChoice, visibleSteps, type QuizAnswers } from "./flow";

const keys = (answers: QuizAnswers) => visibleSteps(quizFixture, answers).map((step) => step.key);
const phq = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`phq-${i + 1}`, "several-days"]));

describe("visibleSteps", () => {
  it("starts with the steps that have no conditions, and no results", () => {
    expect(keys({})).toEqual(["name", "concerns", "test", "main-symptom", "duration", "tried-treatment", "life-events", "email", "phone", "helpful", "improve"]);
  });

  it("shows only the depression check and its results for the depression test", () => {
    const shown = keys({ test: "depression", ...phq });

    expect(shown).toContain("phq-9");
    expect(shown).toContain("depression-results");
    expect(shown).not.toContain("anxiety-next");
    expect(shown).not.toContain("gad-1");
    expect(shown).not.toContain("anxiety-results");
  });

  it("asks whether to continue before the anxiety check, and passes not_in while unanswered", () => {
    expect(keys({ test: "both" })).toEqual(expect.arrayContaining(["anxiety-next", "gad-1", "gad-difficulty", "anxiety-results"]));
    expect(keys({ test: "both", "anxiety-next": "skip" })).not.toContain("gad-1");
    expect(keys({ test: "anxiety" })).not.toContain("anxiety-next");
    expect(keys({ test: "anxiety" })).toContain("gad-7");
  });

  it("ignores the answers of hidden steps", () => {
    // "skip" was picked while testing both, then the test changed: anxiety-next is hidden, so its skip no longer counts.
    expect(keys({ test: "anxiety", "anxiety-next": "skip" })).toContain("gad-1");
    expect(keys({ "tried-treatment": "no", treatments: ["tms"] })).not.toContain("tms-worked");
  });

  it("branches the treatment follow-ups on a multi answer", () => {
    const shown = keys({ "tried-treatment": "yes", treatments: ["antidepressants", "teletherapy"] });

    expect(shown).toEqual(expect.arrayContaining(["treatments", "antidepressant-count", "therapy-sessions"]));
    expect(shown).not.toContain("tms-worked");
  });
});

describe("answersFor", () => {
  const answers: QuizAnswers = {
    name: { first: " Ada ", last: "Lovelace" },
    test: "depression",
    "anxiety-next": "skip",
    concerns: [],
    email: "",
    phone: "253 555 0142",
    helpful: "yes",
    improve: "More detail",
  };

  it("sends the visible, answered submission steps only", () => {
    expect(answersFor(quizFixture, answers, "submission")).toEqual({ name: { first: "Ada", last: "Lovelace" }, test: "depression", phone: "253 555 0142" });
  });

  it("keeps the feedback for the second request", () => {
    expect(answersFor(quizFixture, answers, "feedback")).toEqual({ helpful: "yes", improve: "More detail" });
    expect(isSubmissionStep(quizFixture, "phone")).toBe(true);
    expect(isSubmissionStep(quizFixture, "helpful")).toBe(false);
  });
});

describe("choices and checks", () => {
  const step = (key: string) => quizFixture.steps.find((item) => item.key === key) as QuizStep;

  it("keeps exclusive choices on their own", () => {
    expect(toggleChoice(step("treatments"), ["tms", "ect"], "none")).toEqual(["none"]);
    expect(toggleChoice(step("treatments"), ["none"], "tms")).toEqual(["tms"]);
    expect(toggleChoice(step("treatments"), ["tms", "ect"], "tms")).toEqual(["ect"]);
  });

  it("flags crisis choices only while their step is visible", () => {
    expect(crisisChosen(quizFixture, { test: "depression", "phq-9": "several-days" })).toBe(true);
    expect(crisisChosen(quizFixture, { test: "depression", "phq-9": "not-at-all" })).toBe(false);
    expect(crisisChosen(quizFixture, { test: "anxiety", "phq-9": "several-days" })).toBe(false);
  });

  it("checks contact steps like Laravel does", () => {
    expect(checkStep(step("name"), { first: "", last: "Lovelace" })).toEqual({ "name.first": "Enter your first name so the team knows who to ask for." });
    expect(checkStep(step("phone"), "555-01")).toEqual({ phone: "Enter a 10-digit U.S. phone number, e.g. (253) 555-0142." });
    expect(checkStep(step("phone"), "(253) 555-0142")).toEqual({});
    expect(checkStep(step("email"), "nope")).toEqual({ email: "Enter a valid email address, e.g. you@example.com." });
    expect(checkStep(step("test"), undefined)).toEqual({ test: "Choose an answer to continue." });
    expect(checkStep(step("concerns"), [])).toEqual({});
    expect(checkStep(step("improve"), "")).toEqual({});
  });

  it("emphasises *word* in prompts", () => {
    expect(emphasis("the *most* challenging")).toEqual([
      { text: "the ", strong: false },
      { text: "most", strong: true },
      { text: " challenging", strong: false },
    ]);
  });
});
