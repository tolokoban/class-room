import { SIZE } from "./Retina/size";
import { transformImage } from "./transform";

export const DIGITS = 10;
export const INPUTS = SIZE * SIZE;
/** Number of random transformations of the image used at each training step. */
export const TRANSFORMATIONS = 20;
/** Number of random transformations of each previous example, when they are revised. */
const REVISION_TRANSFORMATIONS = 2;
const LEARNING_RATE = 0.01;

/** An image the perceptron has learnt, and the digit it represents. */
export interface Example {
  image: Uint8Array;
  digit: number;
}

/**
 * Weights of the perceptron: one row of `INPUTS + 1` weights per digit,
 * the last one of each row being the bias.
 */
export function createWeights(): number[] {
  return Array.from({ length: DIGITS * (INPUTS + 1) }, () => 0);
}

/** Probability of each digit, computed with a softmax of the scores. */
export function computeProbabilities(weights: number[], image: Uint8Array): number[] {
  const scores: number[] = [];
  for (let digit = 0; digit < DIGITS; digit++) {
    const offset = digit * (INPUTS + 1);
    let score = weights[offset + INPUTS];
    for (let i = 0; i < INPUTS; i++) {
      if (image[i]) score += weights[offset + i];
    }
    scores.push(score);
  }
  const max = Math.max(...scores);
  const exps = scores.map((score) => Math.exp(score - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((exp) => exp / sum);
}

/** The digit with the highest probability. */
export function predict(weights: number[], image: Uint8Array): number {
  const probabilities = computeProbabilities(weights, image);
  return probabilities.indexOf(Math.max(...probabilities));
}

export interface LearnOptions {
  /** Default to `LEARNING_RATE`. */
  learningRate?: number;
  /** Number of random transformations of the image. Default to `TRANSFORMATIONS`. */
  transformations?: number;
  random?: () => number;
}

/**
 * Learn that `image` is `digit`, using the image itself and `TRANSFORMATIONS` random transformations of it.
 * @returns The new weights.
 */
export function learn(
  weights: number[],
  image: Uint8Array,
  digit: number,
  {
    learningRate = LEARNING_RATE,
    transformations = TRANSFORMATIONS,
    random = Math.random,
  }: LearnOptions = {},
): number[] {
  const result = weights.slice();
  learnOne(result, image, digit, learningRate);
  for (let i = 0; i < transformations; i++) {
    learnOne(result, transformImage(image, random), digit, learningRate);
  }
  return result;
}

/**
 * Learn that `image` is `digit`, then revise each of the `examples` learnt before.
 *
 * Without this revision, each new image would make the perceptron forget the previous ones,
 * and it would always guess the digit it has learnt last.
 * @returns The new weights.
 */
export function learnAndRevise(
  weights: number[],
  image: Uint8Array,
  digit: number,
  examples: Example[],
  options: LearnOptions = {},
): number[] {
  let result = learn(weights, image, digit, options);
  for (const example of examples) {
    result = learn(result, example.image, example.digit, {
      ...options,
      transformations: REVISION_TRANSFORMATIONS,
    });
  }
  return result;
}

/** One step of gradient descent on the cross-entropy. Modifies `weights` in place. */
function learnOne(weights: number[], image: Uint8Array, digit: number, learningRate: number) {
  const probabilities = computeProbabilities(weights, image);
  for (let d = 0; d < DIGITS; d++) {
    const error = probabilities[d] - (d === digit ? 1 : 0);
    const offset = d * (INPUTS + 1);
    for (let i = 0; i < INPUTS; i++) {
      if (image[i]) weights[offset + i] -= learningRate * error;
    }
    weights[offset + INPUTS] -= learningRate * error;
  }
}
