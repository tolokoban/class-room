/**
 * Tiny neural network: 3 inputs (±1) → 4 hidden neurons (sigmoid) → 4 outputs (softmax).
 * Trained by gradient descent on the cross-entropy loss.
 */

/** The 4 suits of a deck of cards. */
export const ITEMS = ["spade", "heart", "diamond", "club"] as const;
export type Item = (typeof ITEMS)[number];

export const INPUT_COUNT = 3;
export const HIDDEN_COUNT = 4;
export const OUTPUT_COUNT = ITEMS.length;
/** Number of cells the inputs can encode. The array has one cell less: the last one is never learned. */
export const CELL_COUNT = 2 ** INPUT_COUNT;
export const LEARNING_RATE = 1;
/** Initial weights are random between -INITIAL_RANGE and +INITIAL_RANGE. */
export const INITIAL_RANGE = 2;

export interface Weights {
  /** `hidden[k][j]`: weight from input `j` to hidden neuron `k`. */
  hidden: number[][];
  hiddenBias: number[];
  /** `output[c][k]`: weight from hidden neuron `k` to output `c`. */
  output: number[][];
  outputBias: number[];
}

export interface Run {
  index: number;
  inputs: number[];
  hidden: number[];
  /** Confidence of each item, between 0 and 1 (their sum is 1). */
  outputs: number[];
  /** Index of the greatest output. */
  guess: number;
}

export function createArray(): Item[] {
  const array: Item[] = ["spade", "spade", "spade", "heart", "heart", "diamond", "club"];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function createWeights(): Weights {
  const random = () => (Math.random() * 2 - 1) * INITIAL_RANGE;
  const matrix = (rows: number, cols: number) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, random));
  return {
    hidden: matrix(HIDDEN_COUNT, INPUT_COUNT),
    hiddenBias: Array.from({ length: HIDDEN_COUNT }, random),
    output: matrix(OUTPUT_COUNT, HIDDEN_COUNT),
    outputBias: Array.from({ length: OUTPUT_COUNT }, random),
  };
}

/**
 * The bits of `index`, most significant first, with -1 for 0 and +1 for 1.
 */
export function indexToInputs(index: number): number[] {
  return Array.from({ length: INPUT_COUNT }, (_, j) =>
    (index >> (INPUT_COUNT - 1 - j)) & 1 ? 1 : -1,
  );
}

export function run(weights: Weights, index: number): Run {
  const inputs = indexToInputs(index);
  const hidden = weights.hidden.map((row, k) => sigmoid(dot(row, inputs) + weights.hiddenBias[k]));
  const outputs = softmax(weights.output.map((row, c) => dot(row, hidden) + weights.outputBias[c]));
  return { index, inputs, hidden, outputs, guess: argmax(outputs) };
}

/**
 * One step of gradient descent (backpropagation) for the item at `index`.
 * @returns New weights: the argument is not modified.
 */
export function train(weights: Weights, { inputs, hidden, outputs }: Run, target: Item): Weights {
  const targetIndex = ITEMS.indexOf(target);
  // Derivative of the cross-entropy loss with respect to the outputs before softmax.
  const outputError = outputs.map((p, c) => p - (c === targetIndex ? 1 : 0));
  // Error propagated back to each hidden neuron, through the sigmoid.
  const hiddenError = hidden.map(
    (h, k) => outputError.reduce((sum, e, c) => sum + e * weights.output[c][k], 0) * h * (1 - h),
  );
  return {
    output: weights.output.map((row, c) =>
      row.map((w, k) => w - LEARNING_RATE * outputError[c] * hidden[k]),
    ),
    outputBias: weights.outputBias.map((b, c) => b - LEARNING_RATE * outputError[c]),
    hidden: weights.hidden.map((row, k) =>
      row.map((w, j) => w - LEARNING_RATE * hiddenError[k] * inputs[j]),
    ),
    hiddenBias: weights.hiddenBias.map((b, k) => b - LEARNING_RATE * hiddenError[k]),
  };
}

/**
 * Repeat `count` times: guess a random cell, then correct the coefficients.
 */
export function trainRandomly(weights: Weights, array: Item[], count: number): Weights {
  let current = weights;
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * array.length);
    current = train(current, run(current, index), array[index]);
  }
  return current;
}

/**
 * Guess every cell the inputs can encode, including the last one
 * that is not in the array (extrapolation).
 */
export function runAll(weights: Weights): Run[] {
  return Array.from({ length: CELL_COUNT }, (_, index) => run(weights, index));
}

export function isCorrect(result: Run, array: Item[]): boolean {
  return ITEMS[result.guess] === array[result.index];
}

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function softmax(values: number[]): number[] {
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/**
 * Index of the strictly greatest value. In case of a tie, returns -1,
 * which is never a correct guess.
 */
function argmax(values: number[]): number {
  let best = 0;
  let tie = false;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[best]) {
      best = i;
      tie = false;
    } else if (values[i] === values[best]) {
      tie = true;
    }
  }
  return tie ? -1 : best;
}
