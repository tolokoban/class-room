import React from "react";

import { useServiceActivityCurrent } from "@/service/hooks/activity";
import { Quiz } from "@/types";
import { QUIZZES } from "./quizzes";

/**
 * Load the quiz of the current activity of `classroom`.
 * `quiz` is `null` if this activity is not a quiz.
 */
export function useCurrentQuiz(classroom: string) {
  const current = useServiceActivityCurrent(classroom);
  const code = current.data;
  const [loaded, setLoaded] = React.useState<{ code: string; quiz: Quiz | null } | null>(null);
  React.useEffect(() => {
    if (!code) return;

    const load = QUIZZES[code];
    if (!load) {
      setLoaded({ code, quiz: null });
      return;
    }
    let alive = true;
    load()
      .then((quiz) => alive && setLoaded({ code, quiz }))
      .catch((error: unknown) => {
        console.error(`Unable to load the quiz of activity "${code}":`, error);
        if (alive) setLoaded({ code, quiz: null });
      });
    return () => {
      alive = false;
    };
  }, [code]);
  const quiz = code && loaded?.code === code ? loaded.quiz : undefined;

  return {
    isLoading: current.isLoading || (Boolean(code) && quiz === undefined),
    error: current.error,
    /** `undefined` while loading, `null` if there is no current activity. */
    code,
    quiz,
  };
}
