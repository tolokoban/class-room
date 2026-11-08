/// <reference types="@rspack/core/module" />

import { Quiz } from "@/types";

/**
 * Every `quiz.ts` or `quiz.tsx` file found in the activities folder,
 * lazily loaded (one chunk per quiz).
 */
const context = import.meta.webpackContext("../../../student/[classroom]/activity", {
  recursive: true,
  regExp: /\/quiz\.tsx?$/,
  mode: "lazy",
});

/**
 * Lazy loaders of the quizzes, per activity code.
 * An activity that is not in this list has no results to display.
 */
export const QUIZZES: Record<string, () => Promise<Quiz>> = Object.fromEntries(
  context.keys().map((key) => [
    // "./AI/bilan-1/quiz.tsx" -> "AI/bilan-1"
    key.replace(/^\.\//, "").replace(/\/quiz\.tsx?$/, ""),
    () => (context(key) as Promise<{ QUIZ: Quiz }>).then((m) => m.QUIZ),
  ]),
);
