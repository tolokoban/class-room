import { Quiz } from "@/types";

/**
 * Lazy loaders of the quizzes, per activity code.
 * An activity that is not in this list has no results to display.
 */
export const QUIZZES: Record<string, () => Promise<Quiz>> = {
  "AI/CRAFT": () => import("@/app/student/[classroom]/activity/AI/CRAFT/quiz").then((m) => m.QUIZ),
  "AI/usage": () => import("@/app/student/[classroom]/activity/AI/usage/quiz").then((m) => m.QUIZ),
  "security/personal-data/AI-Act": () =>
    import("@/app/student/[classroom]/activity/security/personal-data/AI-Act/quiz").then(
      (m) => m.QUIZ,
    ),
  "security/personal-data/RGPD": () =>
    import("@/app/student/[classroom]/activity/security/personal-data/RGPD/quiz").then(
      (m) => m.QUIZ,
    ),
};
