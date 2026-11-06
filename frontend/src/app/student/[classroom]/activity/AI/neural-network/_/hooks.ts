import React from "react";

import { formatPercent, guessIcon, ICONS } from "./icons";
import {
  createArray,
  createWeights,
  isCorrect,
  type Item,
  run,
  type Run,
  runAll,
  train,
  trainRandomly,
  type Weights,
} from "./model";
import { useTranslation } from "./translation";

export interface Step {
  weights: Weights;
  /** Weights before the last correction, to highlight what changed. */
  previous: Weights | null;
  /** Result of the network for the cell clicked by the user. */
  run: Run | null;
  /** Guesses for the whole array, after the correction. */
  guesses: Run[] | null;
  /** Number of random training rounds applied after this step (0 for none). */
  rounds: number;
}

const ROUNDS = 10;

export function useGame() {
  const tr = useTranslation();
  const [array, setArray] = React.useState<Item[]>(createArray);
  const [steps, setSteps] = React.useState<Step[]>(createSteps);
  const refMain = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    // At the beginning, keep the introduction visible.
    if (steps.length < 2) {
      refMain.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Show the step that has just been run (the waiting step is not displayed).
    const sections = refMain.current?.querySelectorAll("section");
    sections?.[sections.length - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [steps]);
  const handleItemClick = (index: number) => {
    setSteps((list) => {
      const last = list[list.length - 1];
      const result = run(last.weights, index);
      const weights = train(last.weights, result, array[index]);
      return [
        ...list.slice(0, -1),
        { ...last, run: result, guesses: runAll(weights) },
        createStep(weights, last.weights),
      ];
    });
  };
  const handleAddRounds = () => {
    setSteps((list) => {
      const last = list[list.length - 1];
      const weights = trainRandomly(last.weights, array, ROUNDS);
      return [
        ...list.slice(0, -1),
        { ...last, rounds: ROUNDS, guesses: runAll(weights) },
        createStep(weights, last.weights),
      ];
    });
  };
  const handleRestart = () => {
    setArray(createArray());
    setSteps(createSteps());
  };
  const getVerdict = (result: Run): string => {
    const confidence = formatPercent(result.outputs[result.guess] ?? 0);
    const guess = guessIcon(result.guess);
    return isCorrect(result, array)
      ? tr.correct$(`${result.index}`, guess, confidence)
      : tr.wrong$(`${result.index}`, guess, confidence, ICONS[array[result.index]]);
  };
  return {
    tr,
    array,
    steps,
    trainings: countTrainings(steps),
    refMain,
    rounds: ROUNDS,
    handleItemClick,
    handleAddRounds,
    handleRestart,
    getVerdict,
  };
}

function createSteps(): Step[] {
  return [createStep(createWeights(), null)];
}

function createStep(weights: Weights, previous: Weights | null): Step {
  return { weights, previous, run: null, guesses: null, rounds: 0 };
}

/**
 * The last step waits for the next click. It is only displayed at the beginning:
 * afterwards, the previous step already shows the guesses of its weights.
 */
export function getVisibleSteps(steps: Step[]): Step[] {
  return steps.length > 1 ? steps.slice(0, -1) : steps;
}

/**
 * Each click is one training, and each batch counts for its number of rounds.
 */
function countTrainings(steps: Step[]): number {
  return steps.reduce((count, step) => count + (step.run ? 1 : 0) + step.rounds, 0);
}
