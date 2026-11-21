/**
 * Precompute the embeddings of the questions and of the animals' names,
 * and write them in `data/vectors.dat` (16 bits floats, little endian).
 * `data/questions.ts` and `data/animals.ts` only hold offsets in this file.
 * It also computes the projection used by the 3D view (`data/projection.ts`).
 *
 * Only run it again if you change the data or the model (see `../../_/model.ts`):
 *   npm run embeddings
 * It needs Node 24+, for `Float16Array`.
 */
import Path from "node:path";

import { EmbeddingsStore, fitProjection, writeTypeScript } from "../../_/generator.mts";
import {
  ANIMALS,
  type AnimalFacts,
  type BooleanKey,
  type ContinentKey,
  type Fact,
} from "./source/animals.ts";
import { QUESTIONS, type QuestionKey } from "./source/questions.ts";
import type { Animals, Questions } from "./types.ts";
import {
  COLOR,
  CONTINENT,
  CONTINENTS,
  LEGS,
  LEGS_NONE,
  SIZE,
  SOUND,
  WEIGHT,
  YES_NO,
} from "./source/templates.ts";

const MIN_ANSWERS = 10;
const NUMBERS = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit"];
const DATA_DIR = Path.resolve(import.meta.dirname, "data");

/** All the embeddings, one after the other. */
const store = await EmbeddingsStore.create();

/**
 * @returns The offsets of the embeddings of `texts` in `vectors.dat`.
 */
function embed(texts: string[]): Promise<number[]> {
  return store.embed(texts, "query");
}

function split<T>(fact: Fact<T> | undefined, defaultValue: T): [T, string[]] {
  if (Array.isArray(fact)) {
    const [value, ...notes] = fact;
    return [value, notes];
  }
  return [fact ?? defaultValue, []];
}

/** Upper case at the beginning of the text, and after the end of each sentence. */
function capitalize(text: string): string {
  return text.replace(
    /(^|[.?!…]\s+)(\p{Ll})/gu,
    (_, before: string, letter: string) => `${before}${letter.toUpperCase()}`,
  );
}

function fill(templates: string[], value: string): string[] {
  return templates.map((template) =>
    // No period after an exclamation: "« Groaaar ! »." becomes "« Groaaar ! »".
    capitalize(template.replace("$", value)).replace(/([!?…]\s*»?)\.$/, "$1"),
  );
}

/** Specific answers are added to the shared ones, or replace them if they are numerous enough. */
function merge(shared: string[], notes: string[]): string[] {
  return notes.length >= MIN_ANSWERS ? notes : [...shared, ...notes];
}

/**
 * When an animal does not give a value for the key, it takes the opposite value of the other key.
 * Only the value is taken, not the specific answers: they answer the other question.
 */
const OPPOSITES: Partial<Record<BooleanKey, BooleanKey>> = {
  peaceful: "aggressive",
};

/**
 * @returns The value of the boolean fact `key` of `animal`, with its specific answers.
 * A missing fact is the opposite of its key in `OPPOSITES`, if any, or else `false`.
 */
function getBooleanFact(animal: AnimalFacts, key: BooleanKey): [boolean, string[]] {
  const opposite = OPPOSITES[key];
  if (animal[key] === undefined && opposite) return [!split(animal[opposite], false)[0], []];

  return split(animal[key], false);
}

function makeAnswers(animal: AnimalFacts): Record<QuestionKey, string[]> {
  const [legs, legsNotes] = split(animal.legs, 0);
  const answers: Partial<Record<QuestionKey, string[]>> = {
    legs: merge(legs === 0 ? LEGS_NONE : fill(LEGS, NUMBERS[legs] ?? `${legs}`), legsNotes),
    color: fill(COLOR, animal.color),
    size: fill(SIZE, animal.size),
    weight: fill(WEIGHT, animal.weight),
    sound: fill(SOUND, animal.sound),
  };
  const [omnivore] = split(animal.omnivore, false);
  for (const [key, templates] of Object.entries(YES_NO)) {
    const [value, notes] = getBooleanFact(animal, key as BooleanKey);
    const shared = value
      ? templates.yes
      : omnivore && templates.omnivore
        ? templates.omnivore
        : templates.no;
    answers[key as BooleanKey] = merge(shared, notes);
  }
  for (const [key, where] of Object.entries(CONTINENTS)) {
    const [value, notes] = split(animal[key as ContinentKey], false);
    answers[key as ContinentKey] = merge(fill(value ? CONTINENT.yes : CONTINENT.no, where), notes);
  }
  for (const key of Object.keys(QUESTIONS) as QuestionKey[]) {
    const count = answers[key]?.length ?? 0;
    if (count < MIN_ANSWERS)
      throw new Error(`Only ${count} answers for "${key}" of ${animal.name}!`);
  }
  return answers as Record<QuestionKey, string[]>;
}

function checkDiet(animal: AnimalFacts) {
  const diets = (["carnivore", "herbivore", "omnivore"] as const).filter(
    (key) => split(animal[key], false)[0],
  );
  if (diets.length !== 1)
    throw new Error(`${animal.name} must have exactly one diet, not [${diets.join(", ")}]!`);
}

/** Write a file of `data/` that exports `value`, typed with a type of `../types.ts`. */
function write(filename: string, type: string, name: string, value: unknown) {
  writeTypeScript(Path.resolve(DATA_DIR, filename), { name: type, from: "../types" }, name, value);
}

/** Fisher LDA on the questions: each question and its wordings are a group. */
function makeProjection(questions: Questions) {
  return fitProjection(
    Object.values(questions).map((list) => list.map(({ offset }) => store.vectorAt(offset))),
  );
}

const questions: Questions = {};
for (const [key, list] of Object.entries(QUESTIONS)) {
  const offsets = await embed([...list]);
  questions[key] = list.map((question, index) => ({ question, offset: offsets[index] }));
}
write("questions.ts", "Questions", "QUESTIONS", questions);
write("projection.ts", "Projection", "PROJECTION", makeProjection(questions));

ANIMALS.forEach(checkDiet);
const animals: Animals = [];
for (const animal of ANIMALS) {
  const names = [animal.name, ...(animal.aliases ?? [])];
  // The students' guesses are questions ("C'est un lion ?"), so they are closer
  // to a question than to a bare name: we embed the name inside a question.
  const offsets = await embed(names.map((name) => `Est-ce ${name} ?`));
  animals.push({
    name: animal.name,
    names: names.map((name, index) => ({ name, offset: offsets[index] })),
    answers: makeAnswers(animal),
  });
}
write("animals.ts", "Animals", "ANIMALS", animals);

store.writeVectors(Path.resolve(DATA_DIR, "vectors.dat"));
