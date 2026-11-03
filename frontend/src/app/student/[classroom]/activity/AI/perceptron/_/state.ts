import AtomicState from "@tolokoban/react-state";
import { isType } from "@tolokoban/type-guards";

import { createWeights, DIGITS, type Example, INPUTS } from "./model";
import { persistInSessionStorage } from "@/state/session-storage";

export interface Perceptron {
  weights: number[];
  /** Number of images the perceptron has learnt from. */
  steps: number;
  /** Number of times the user told the perceptron which digit it was shown. */
  answers: number;
  /** Number of answers for which the perceptron had guessed the right digit. */
  successes: number;
  /** A pre-trained perceptron never learns: its weights are never changed. */
  pretrained: boolean;
  /** The images learnt so far, to revise them at each new answer (see `learnAndRevise()`). */
  examples: StoredExample[];
}

/** An `Example` whose image is stored as a string of "0" and "1", to save space. */
export interface StoredExample {
  image: string;
  digit: number;
}

export function storeExample({ image, digit }: Example): StoredExample {
  return { image: image.join(""), digit };
}

export function restoreExample({ image, digit }: StoredExample): Example {
  return { image: Uint8Array.from(image, (char) => (char === "1" ? 1 : 0)), digit };
}

export function createPerceptron(): Perceptron {
  return {
    weights: createWeights(),
    steps: 0,
    answers: 0,
    successes: 0,
    pretrained: false,
    examples: [],
  };
}

function isPerceptron(data: unknown): data is Perceptron {
  return (
    isType(data, {
      weights: ["array", "number"],
      steps: "number",
      answers: "number",
      successes: "number",
      pretrained: "boolean",
      examples: ["array", { image: "string", digit: "number" }],
    }) && data.weights.length === DIGITS * (INPUTS + 1)
  );
}

export const PerceptronState = new AtomicState<Perceptron>(createPerceptron());

persistInSessionStorage(PerceptronState, "perceptron", isPerceptron);
