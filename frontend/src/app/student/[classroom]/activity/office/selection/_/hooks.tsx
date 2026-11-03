import { useLangValue } from "@tolokoban/react-state";
import { useModal } from "@tolokoban/ui";
import React from "react";

import { EXERCISES } from "../exercices";
import { Result } from "./Result";
import { applyKey, createEditorState, type EditorState, type KeyStroke } from "./keyboard";
import { parseRichText, type RichText, richTextEquals } from "./rich-text";
import { ACTIVITY_CODE, type Scores } from "./scores";
import { SolverClient } from "./solver-client";
import { computeScore } from "./strokes";
import { useTranslation } from "./translation";
import { gotoTarget, useRouteParamAsString } from "@/app/routes";
import { Notif } from "@/components/Notification";
import { useServiceActivityResultSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { isTeacher, State } from "@/state";
import { MultiLang } from "@/utils/multilang";

/** The ids of the exercises in the order of their declaration. */
const EXERCISE_IDS = Object.keys(EXERCISES);

interface Attempt {
  editor: EditorState;
  /** Keystrokes of the student since the start of the attempt. */
  strokes: KeyStroke[];
  /** The text matches the expected one. */
  finished: boolean;
  /** Incremented at each attempt, to give the focus back to the editor. */
  id: number;
}

export function useSelectionActivity() {
  const lang = useLangValue();
  const [index, setIndex] = React.useState(0);
  const [attempt, setAttempt] = React.useState<Attempt>(() => createAttempt(0, 0));
  const exerciseId = EXERCISE_IDS[index];
  const exercise = EXERCISES[exerciseId] as (typeof EXERCISES)[string] | undefined;
  const expected = React.useMemo(() => parse(exercise?.expected), [exercise]);
  const solver = useSolver(exercise?.input, expected);
  const showResult = useShowResult();
  const saveScore = useScoreSaver();
  const goTo = (next: number) => {
    setIndex(next);
    setAttempt(createAttempt(next, attempt.id + 1));
  };
  const handleRestart = () => goTo(index);
  const handleKeyStroke = (stroke: KeyStroke): boolean => {
    // Swallow the keys while the result is displayed.
    if (attempt.finished) return true;

    const editor = applyKey(attempt.editor, stroke);
    if (!editor) return false;

    const strokes = [...attempt.strokes, stroke];
    const finished = richTextEquals(editor.text, expected);
    setAttempt({ ...attempt, editor, strokes, finished });
    if (finished && solver) {
      void showResult(solver, strokes, {
        onScore: (score) => saveScore(exerciseId, score),
        onRestart: handleRestart,
        onContinue: () => goTo(index + 1),
      });
    }
    return true;
  };
  return {
    exercise,
    title: exercise ? MultiLang.get(exercise.title, lang) : "",
    progress: { index: index + 1, count: EXERCISE_IDS.length },
    editor: attempt.editor,
    focusKey: attempt.id,
    expected,
    strokes: attempt.strokes.length,
    handleKeyStroke,
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

  return () => gotoTarget(null, "/teacher/[classroom]/activity/office/selection", classroom);
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

/** Start searching the best solution as soon as the exercise is displayed. */
function useSolver(input: string | undefined, expected: RichText): SolverClient | null {
  const [solver, setSolver] = React.useState<SolverClient | null>(null);
  React.useEffect(() => {
    if (input === undefined) return;

    const client = new SolverClient(parse(input), expected);
    setSolver(client);
    return () => client.terminate();
  }, [input, expected]);
  return solver;
}

interface ResultHandlers {
  onScore(score: number): void;
  onRestart(): void;
  onContinue(): void;
}

function useShowResult() {
  const tr = useTranslation();
  const modal = useModal();
  return async (solver: SolverClient, strokes: KeyStroke[], handlers: ResultHandlers) => {
    const { onScore, onRestart, onContinue } = handlers;
    const solution = await modal.wait(tr.computing, solver.pick(strokes));
    // Without solution, we cannot compute the score.
    if (solution) onScore(computeScore(strokes.length, solution.length));
    const hide = modal.show({
      autoClosable: false,
      content: (
        <Result
          strokes={strokes}
          solution={solution}
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

function createAttempt(index: number, id: number): Attempt {
  return {
    editor: createEditorState(parse(EXERCISES[EXERCISE_IDS[index]]?.input)),
    strokes: [],
    finished: false,
    id,
  };
}

function parse(source: string | undefined): RichText {
  return source === undefined ? [] : parseRichText(source);
}
