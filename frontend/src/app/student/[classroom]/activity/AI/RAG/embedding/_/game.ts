import { dot, similarity } from "../../_/vectors";
import type { Neighbour } from "../../_/VectorsView";
import { ANIMALS } from "./data/animals";
import { QUESTIONS } from "./data/questions";
import type { Animals } from "./types";

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
/**
 * Two sentences of the student are considered the same question above this similarity.
 * Rewordings of the same question score between 0.94 and 0.99, but different questions
 * can reach 0.92 ("c'est un chat ?" and "c'est un chien ?", "il est agressif" and "il est pacifique").
 */
const REPEAT_MIN_SIMILARITY = 0.94;

export type Reply =
  /** The student asked a known question. */
  | {
      type: "answer";
      answer: string;
      /** Key of the question in `QUESTIONS`: all its wordings share the same key. */
      key: string;
      question: string;
      similarity: number;
    }
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

/**
 * @returns The `count` questions that are the closest to `vector`, the closest first,
 * through their closest wording.
 */
export function nearestQuestions(
  vector: number[],
  vectors: Float32Array,
  count: number,
): Neighbour[] {
  return rank(vector, vectors, Object.values(QUESTIONS), (list) => list.map(({ offset }) => offset))
    .slice(0, count)
    .map(({ item, index, similarity }) => toNeighbour(item[index], similarity));
}

/**
 * @returns The question that is the farthest from `vector`, through its closest wording.
 */
export function farthestQuestion(vector: number[], vectors: Float32Array): Neighbour | null {
  const ranking = rank(vector, vectors, Object.values(QUESTIONS), (list) =>
    list.map(({ offset }) => offset),
  );
  const last = ranking[ranking.length - 1];
  if (!last) return null;

  return toNeighbour(last.item[last.index], last.similarity);
}

/** A wording of a question, as the 3D view expects it. */
function toNeighbour(
  { question, offset }: { question: string; offset: number },
  similarity: number,
): Neighbour {
  return { text: question, offset, similarity };
}

/** What the game understood a sentence of the student as. */
export interface Understanding {
  /** Two sentences understood the same way have the same id. */
  id: string;
  /** What to show the student: the closest wording, or the guessed animal. */
  label: string;
}

/**
 * @returns What the game understood the student's sentence as,
 * or `null` if it did not understand it.
 */
export function understandingOf(reply: Reply): Understanding | null {
  switch (reply.type) {
    case "answer":
      return { id: `question:${reply.key}`, label: reply.question };
    case "guess":
      return { id: `animal:${reply.name}`, label: reply.name };
    case "vague":
      return null;
  }
}

/** A sentence the student has already sent during the current game. */
export interface PreviousQuestion {
  text: string;
  /** Normalized embedding of `text`. */
  vector: number[];
  understanding: Understanding | null;
}

/**
 * @returns `true` if the two sentences have not been understood the same way.
 * Two sentences that were both too vague are understood the same way.
 */
export function isUnderstoodDifferently(a: Understanding | null, b: Understanding | null): boolean {
  return a?.id !== b?.id;
}

/**
 * @param vector Normalized embedding of the student's new sentence.
 * @returns The previous question that is almost the same as the new one, or `null`.
 * If several match, the closest one.
 */
export function findRepeat(
  vector: number[],
  history: PreviousQuestion[],
): (PreviousQuestion & { similarity: number }) | null {
  let best: (PreviousQuestion & { similarity: number }) | null = null;
  for (const previous of history) {
    const value = dot(vector, previous.vector);
    if (value >= REPEAT_MIN_SIMILARITY && value > (best?.similarity ?? 0))
      best = { ...previous, similarity: value };
  }
  return best;
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
      key,
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
  const [best, second] = rank(vector, vectors, items, getOffsets);
  return { ...best, margin: best.similarity - (second?.similarity ?? 0) };
}

/**
 * @returns The items, sorted from the closest to `vector` to the farthest.
 */
function rank<T>(
  vector: number[],
  vectors: Float32Array,
  items: T[],
  getOffsets: (item: T) => number[],
): Array<Omit<Match<T>, "margin">> {
  return items
    .map((item) => {
      const similarities = getOffsets(item).map((offset) => similarity(vector, vectors, offset));
      const max = Math.max(...similarities);
      return { item, index: similarities.indexOf(max), similarity: max };
    })
    .sort((a, b) => b.similarity - a.similarity);
}
