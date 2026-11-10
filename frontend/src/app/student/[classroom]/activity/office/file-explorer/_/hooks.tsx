import { useLangValue } from "@tolokoban/react-state";
import { useModal } from "@tolokoban/ui";
import React from "react";

import { EXERCISES, type Exercise } from "../exercises";
import { applyClick, type Click, type ExplorerState, maskOf } from "./explorer";
import { Result } from "./Result";
import { ACTIVITY_CODE, computeScore, type Scores } from "./scores";
import { initialState } from "./state";
import { gotoTarget, useRouteParamAsString } from "@/app/routes";
import { Notif } from "@/components/Notification";
import { useServiceActivityResultSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { isTeacher, State } from "@/state";
import { MultiLang } from "@/utils/multilang";

/** The ids of the exercises in the order of their declaration. */
const EXERCISE_IDS = Object.keys(EXERCISES);

interface Attempt {
  state: ExplorerState;
  clicks: number;
  /** The selection matches the expected one. */
  finished: boolean;
}

export function useFileExplorerActivity() {
  const lang = useLangValue();
  const [index, setIndex] = React.useState(0);
  const [attempt, setAttempt] = React.useState<Attempt>(() => createAttempt(0));
  const exerciseId = EXERCISE_IDS[index];
  const exercise = EXERCISES[exerciseId] as Exercise | undefined;
  const showResult = useShowResult();
  const saveScore = useScoreSaver();
  const goTo = (next: number) => {
    setIndex(next);
    setAttempt(createAttempt(next));
  };
  const handleRestart = () => goTo(index);
  const handleClick = (click: Click) => {
    if (!exercise || attempt.finished) return;

    const state = applyClick(attempt.state, click);
    const clicks = attempt.clicks + 1;
    const finished = state.mask === maskOf(exercise.expected);
    setAttempt({ state, clicks, finished });
    if (!finished) return;

    const score = computeScore(clicks, exercise.solution.length);
    saveScore(exerciseId, score);
    showResult(clicks, exercise, { onRestart: handleRestart, onContinue: () => goTo(index + 1) });
  };
  return {
    exercise,
    title: exercise ? MultiLang.get(exercise.title, lang) : "",
    progress: { index: index + 1, count: EXERCISE_IDS.length },
    state: attempt.state,
    expectedMask: maskOf(exercise?.expected ?? []),
    clicks: attempt.clicks,
    handleClick,
    handleRestart,
    handleRestartAll: () => goTo(0),
    handleResults: useResultsHandler(),
  };
}

/**
 * @returns A handler to open the results page, or `undefined` if the user is not a teacher.
 */
function useResultsHandler(): (() => void) | undefined {
  const user = State.user.useValue();
  const classroom = useRouteParamAsString("classroom");
  if (!isTeacher(user)) return undefined;

  return () => gotoTarget(null, "/teacher/[classroom]/activity/office/file-explorer", classroom);
}

/**
 * @returns A function that stores the best score of the student for an exercise
 * with entrypoint `activity/result-set`. Teachers' scores are not stored.
 */
function useScoreSaver() {
  const user = State.user.useValue();
  const computer = State.computer.useValue();
  const classroomCode = useRouteParamAsString("classroom");
  const service = useServiceActivityResultSet();
  const translateError = useApiErrorTranslator();
  /** The backend does not give the student their results back, so we keep them here. */
  const scores = React.useRef<Scores>({});
  return (exerciseId: string, score: number) => {
    if (typeof user !== "string") return;

    const best = Math.max(score, scores.current[exerciseId] ?? 0);
    scores.current = { ...scores.current, [exerciseId]: best };
    service
      .mutate({
        classroomCode,
        activityCode: ACTIVITY_CODE,
        computer,
        nickname: user,
        result: JSON.stringify(scores.current),
      })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
}

interface ResultHandlers {
  onRestart(): void;
  onContinue(): void;
}

function useShowResult() {
  const modal = useModal();
  return (clicks: number, exercise: Exercise, { onRestart, onContinue }: ResultHandlers) => {
    const hide = modal.show({
      autoClosable: false,
      content: (
        <Result
          clicks={clicks}
          solution={exercise.solution}
          onRestart={() => {
            hide();
            onRestart();
          }}
          onContinue={() => {
            hide();
            onContinue();
          }}
        />
      ),
    });
  };
}

function createAttempt(index: number): Attempt {
  const exercise = EXERCISES[EXERCISE_IDS[index]] as Exercise | undefined;
  return {
    state: exercise ? initialState(exercise) : { mask: 0, anchor: null },
    clicks: 0,
    finished: false,
  };
}
