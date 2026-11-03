import { useLangValue } from "@tolokoban/react-state";
import React from "react";

import { gotoTarget } from "@/app/routes";
import { EXERCISES } from "@/app/student/[classroom]/activity/office/selection/exercices";
import {
  ACTIVITY_CODE,
  parseScores,
} from "@/app/student/[classroom]/activity/office/selection/_/scores";
import { useServiceActivityResultAll } from "@/service/hooks/activity";
import { MultiLang } from "@/utils/multilang";

/** Delay (in msec) between two reloads of the students' results. */
const REFRESH_INTERVAL = 3000;

/**
 * Scores of the students of `classroom`, per exercise.
 * The results are reloaded every `REFRESH_INTERVAL` msec.
 */
export function useSelectionResults(classroom: string) {
  const lang = useLangValue();
  const results = useServiceActivityResultAll(classroom, ACTIVITY_CODE);
  usePolling(results.refresh);
  const exercises = Object.entries(EXERCISES).map(([id, exercise]) => ({
    id,
    title: MultiLang.get(exercise.title, lang),
  }));
  const students = Object.entries(results.data ?? {})
    .map(([nickname, result]) => {
      const scores = parseScores(result);
      return { nickname, scores, average: average(Object.values(scores)) };
    })
    .sort((a, b) => a.nickname.localeCompare(b.nickname));
  return {
    isLoading: results.isLoading,
    error: results.error,
    exercises,
    students,
    /** Average score of each exercise, among the students who have done it. */
    averages: exercises.map(({ id }) =>
      average(students.flatMap(({ scores }) => (id in scores ? [scores[id]] : []))),
    ),
    handleBack: () => gotoTarget(null, "/student/[classroom]/activity/office/selection", classroom),
  };
}

/** @returns The rounded average, or `undefined` for an empty list. */
function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function usePolling(refresh: () => void) {
  const ref = React.useRef(refresh);
  ref.current = refresh;
  React.useEffect(() => {
    const id = window.setInterval(() => ref.current(), REFRESH_INTERVAL);
    return () => window.clearInterval(id);
  }, []);
}
