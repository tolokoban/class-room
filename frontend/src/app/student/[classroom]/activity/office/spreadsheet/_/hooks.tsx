import { useLangValue } from "@tolokoban/react-state";
import { useModal } from "@tolokoban/ui";
import React from "react";

import { EXERCISES } from "../exercises";
import { type Exercise } from "./exercise";
import { Failure } from "./Failure";
import { findLongFormulas, findMissingDollars, findWrongFormulas } from "./match";
import { type Notion } from "./NotionList";
import { type Cells } from "./Sheet/engine/address";
import { useSolvedExercises } from "./solved";
import { type CellFormula, Success } from "./Success";
import { isTeacher, State } from "@/state";
import { MultiLang } from "@/utils/multilang";

/** The ids of the exercises in the order of their declaration. */
const EXERCISE_IDS = Object.keys(EXERCISES);

export function useSpreadsheetActivity() {
  const lang = useLangValue();
  const user = State.user.useValue();
  const solved = useSolvedExercises();
  const [index, setIndex] = React.useState(() => getFirstUnsolvedIndex(solved.ids));
  const exerciseId = EXERCISE_IDS[index] as string | undefined;
  const exercise = exerciseId ? (EXERCISES[exerciseId] as Exercise | undefined) : undefined;
  const [cells, setCells] = React.useState<Cells>(exercise?.initial ?? {});
  /** Cells of the student's sheet with a wrong formula, found by the last check. */
  const [wrongCells, setWrongCells] = React.useState<string[]>([]);
  const showSuccess = useShowSuccess();
  const showFailure = useShowFailure();
  const goTo = (next: number) => {
    setIndex(next);
    setCells(EXERCISES[EXERCISE_IDS[next]]?.initial ?? {});
    setWrongCells([]);
  };
  return {
    exercise,
    title: exercise ? MultiLang.get(exercise.title, lang) : "",
    progress: { index: index + 1, count: EXERCISE_IDS.length },
    cells,
    wrongCells,
    navigation: {
      canGoPrevious: index > 0,
      // A teacher can always browse the exercises, solved or not.
      canGoNext: !!exerciseId && (isTeacher(user) || solved.ids.includes(exerciseId)),
      handlePrevious: () => goTo(index - 1),
      handleNext: () => goTo(index + 1),
    },
    handleChange(next: Cells) {
      setCells(next);
      // The highlight of a wrong formula goes away as soon as its cell is edited.
      setWrongCells((keys) => keys.filter((key) => next[key] === cells[key]));
    },
    handleCheck() {
      if (!exerciseId || !exercise) return;

      const wrong = findWrongFormulas(cells, exercise.expected);
      setWrongCells(wrong);
      if (wrong.length > 0) {
        showFailure(wrong.length, exercise.notions);
        return;
      }
      solved.markAsSolved(exerciseId);
      showSuccess({
        longFormulas: findLongFormulas(cells, exercise.expected).map((key) => ({
          key,
          formula: cells[key] ?? "",
        })),
        noDollar: findMissingDollars(cells, exercise.mustUseDollar).length > 0,
        notions: exercise.notions,
        onContinue: () => goTo(index + 1),
        onRestart: () => goTo(index),
      });
    },
    handleRestartAll: () => goTo(0),
  };
}

/** Index of the first exercise not solved yet (`EXERCISE_IDS.length` if all are solved). */
function getFirstUnsolvedIndex(solvedIds: string[]): number {
  const index = EXERCISE_IDS.findIndex((id) => !solvedIds.includes(id));
  return index < 0 ? EXERCISE_IDS.length : index;
}

interface ShowSuccessOptions {
  /** Formulas of the student that are longer than the expected ones. */
  longFormulas: CellFormula[];
  /** Some formulas of the student should use `$` in their references. */
  noDollar: boolean;
  /** Notions needed to solve the exercise. */
  notions?: Notion[];
  onContinue(): void;
  onRestart(): void;
}

function useShowSuccess() {
  const modal = useModal();
  return ({ longFormulas, noDollar, notions, onContinue, onRestart }: ShowSuccessOptions) => {
    const hide = modal.show({
      autoClosable: false,
      align: "TR",
      content: (
        <Success
          longFormulas={longFormulas}
          noDollar={noDollar}
          notions={notions}
          onContinue={() => {
            hide();
            onContinue();
          }}
          onRestart={() => {
            hide();
            onRestart();
          }}
        />
      ),
    });
  };
}

function useShowFailure() {
  const modal = useModal();
  return (wrongCount: number, notions?: Notion[]) => {
    const hide = modal.show({
      autoClosable: true,
      align: "TR",
      content: <Failure wrongCount={wrongCount} notions={notions} onClose={() => hide()} />,
    });
  };
}
