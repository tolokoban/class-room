import { ANIMALS } from "./data/animals";
import { QUESTIONS } from "./data/questions";
import type { Animals } from "./types";
import { similarity } from "./vectors";

export type Animal = Animals[number];

/**
 * With this model, even unrelated sentences have a similarity around 0.85.
 * So we also require the best match to be clearly ahead of the second one,
 * otherwise "Est-il dangereux ?" would be taken for "Est-il diurne ?".
 * These values have been tuned by trying many questions.
 */
const QUESTION_MIN_SIMILARITY = 0.9;
const QUESTION_MIN_MARGIN = 0.01;
const ANIMAL_MIN_SIMILARITY = 0.905;
const ANIMAL_MIN_MARGIN = 0.02;

export type Reply =
  /** The student asked a known question. */
  | { type: "answer"; answer: string; question: string; similarity: number }
  /** The student guessed an animal, the right one or not. */
  | {
      type: "guess";
      found: boolean;
      name: string;
      /** The way of naming the animal that was the closest ("la lionne"). */
      matched: string;
      similarity: number;
    }
  /** We did not understand. */
  | { type: "vague"; question: string; similarity: number };

interface Match<T> {
  item: T;
  /** Index of the closest vector of `item`. */
  index: number;
  similarity: number;
  /** Difference with the similarity of the second closest item. */
  margin: number;
}

export function pickAnimal(previous?: Animal): Animal {
  const candidates = ANIMALS.filter((animal) => animal !== previous);
  return pickOne(candidates);
}

export function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * @param vector Normalized embedding of the student's prompt.
 * @param vectors Precomputed embeddings, from `data/vectors.dat`.
 */
export function reply(animal: Animal, vector: number[], vectors: Float32Array): Reply {
  const questions = Object.entries(QUESTIONS);
  // Several wordings of the same question must not compete with each other:
  // the margin is computed against the closest wording of another question.
  const question = findClosest(vector, vectors, questions, ([, list]) =>
    list.map(({ offset }) => offset),
  );
  const guess = findClosest(vector, vectors, ANIMALS, (item) =>
    item.names.map(({ offset }) => offset),
  );
  if (
    guess.similarity >= ANIMAL_MIN_SIMILARITY &&
    guess.margin >= ANIMAL_MIN_MARGIN &&
    guess.similarity >= question.similarity
  ) {
    const { name, names } = guess.item;
    return {
      type: "guess",
      found: guess.item === animal,
      name,
      matched: names[guess.index].name,
      similarity: guess.similarity,
    };
  }

  const [key, list] = question.item;
  const text = list[question.index].question;
  if (question.similarity >= QUESTION_MIN_SIMILARITY && question.margin >= QUESTION_MIN_MARGIN) {
    return {
      type: "answer",
      answer: pickOne(animal.answers[key]),
      question: text,
      similarity: question.similarity,
    };
  }
  return { type: "vague", question: text, similarity: question.similarity };
}

/**
 * @param getOffsets Offsets in `vectors` of the embeddings of an item.
 */
function findClosest<T>(
  vector: number[],
  vectors: Float32Array,
  items: T[],
  getOffsets: (item: T) => number[],
): Match<T> {
  const sorted = items
    .map((item) => {
      const similarities = getOffsets(item).map((offset) => similarity(vector, vectors, offset));
      const max = Math.max(...similarities);
      return { item, index: similarities.indexOf(max), similarity: max };
    })
    .sort((a, b) => b.similarity - a.similarity);
  const [best, second] = sorted;
  return { ...best, margin: best.similarity - (second?.similarity ?? 0) };
}
