import { similarity } from "../../_/vectors";
import { FABLES } from "./data/fables";
import type { Fable, Passage } from "./types";

/**
 * Spread of the confidence scores (softmax temperature): the lower, the more
 * a small advantage in similarity gives a high confidence.
 * Tuned so that a clear description of a story gives a high confidence to it,
 * and a sentence unrelated to the fables gives a low confidence to all of them.
 */
const TEMPERATURE = 0.01;

/** A fable, with its passage that is the closest to the student's sentence. */
export interface FableMatch {
  fable: Fable;
  passage: Passage;
  /** Cosine similarity between the student's sentence and `passage` (or one of its rewordings). */
  similarity: number;
  /** `true` if the similarity is the one of a rewording of `passage`, not of its own text. */
  viaRewording: boolean;
  /** Between 0 and 1. The confidences of all the fables add up to 1. */
  confidence: number;
}

/**
 * Each fable gets the similarity of its closest passage (whole text, summary or chunk).
 * A chunk is as close as the closest of its text and its rewordings.
 * The confidence is a softmax of these similarities over all the fables:
 * it is high only when a fable is clearly closer than the others.
 * @param vector Normalized embedding of the student's sentence.
 * @param vectors Precomputed embeddings, from `data/vectors.dat`.
 * @returns All the fables, from the closest to the farthest.
 */
export function rankFables(vector: number[], vectors: Float32Array): FableMatch[] {
  const matches = FABLES.map((fable) => {
    let best = { passage: fable.passages[0], similarity: -Infinity, viaRewording: false };
    for (const passage of fable.passages) {
      const value = similarity(vector, vectors, passage.offset);
      if (value > best.similarity) best = { passage, similarity: value, viaRewording: false };
      for (const offset of passage.rewordings ?? []) {
        const value = similarity(vector, vectors, offset);
        if (value > best.similarity) best = { passage, similarity: value, viaRewording: true };
      }
    }
    return { fable, ...best, confidence: 0 };
  }).sort((a, b) => b.similarity - a.similarity);
  const top = matches[0]?.similarity ?? 0;
  // Subtracting the top similarity avoids overflows, and does not change the result.
  const weights = matches.map(({ similarity }) => Math.exp((similarity - top) / TEMPERATURE));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return matches.map((match, index) => ({ ...match, confidence: weights[index] / total }));
}
