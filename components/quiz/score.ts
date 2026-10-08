import type { QuizResult } from "@/lib/content";

/**
 * Picks the self-check result in the visitor's browser (nothing is sent).
 * Same rule as uptms-ad QuizDocument::resultFor: results are checked top to
 * bottom, the first whose conditions all match wins, the default comes last.
 */
export function scoreQuiz<R extends Pick<QuizResult, "when" | "is_default">>(results: R[], answers: Record<string, string>): R | null {
  for (const result of results) {
    if (result.is_default) {
      continue;
    }

    if (result.when.length > 0 && result.when.every((condition) => answers[condition.question] === condition.value)) {
      return result;
    }
  }

  return results.find((result) => result.is_default) ?? null;
}
