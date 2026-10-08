import { describe, expect, it } from "vitest";
import { scoreQuiz } from "./score";

const results = [
  { title: "Coverage", when: [{ question: "topic", value: "insurance" }], is_default: false },
  { title: "Loved one", when: [{ question: "topic", value: "loved-one" }], is_default: false },
  { title: "Call", when: [{ question: "next-step", value: "call" }], is_default: false },
  { title: "Both", when: [{ question: "topic", value: "ocd-other" }, { question: "next-step", value: "info" }], is_default: false },
  { title: "Default", when: [], is_default: true },
];

describe("scoreQuiz", () => {
  it("returns the first rule whose conditions all match", () => {
    expect(scoreQuiz(results, { topic: "insurance", "next-step": "call" })?.title).toBe("Coverage");
    expect(scoreQuiz(results, { topic: "depression", medication: "yes", "next-step": "call" })?.title).toBe("Call");
    expect(scoreQuiz(results, { topic: "ocd-other", "next-step": "info" })?.title).toBe("Both");
  });

  it("needs every condition of a rule, then falls back to the default", () => {
    expect(scoreQuiz(results, { topic: "ocd-other", "next-step": "call" })?.title).toBe("Call");
    expect(scoreQuiz(results, { topic: "depression", "next-step": "info" })?.title).toBe("Default");
  });

  it("never lets the default win early, wherever it sits", () => {
    expect(scoreQuiz([results[4]!, results[0]!], { topic: "insurance" })?.title).toBe("Coverage");
  });
});
