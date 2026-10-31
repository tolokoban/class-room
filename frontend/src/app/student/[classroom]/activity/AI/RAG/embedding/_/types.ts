/**
 * The embeddings are not stored here, but in `data/vectors.dat`:
 * an `offset` is the index of the first value of an embedding in this file,
 * once decoded as a `Float32Array` (see `vectors.ts`).
 */

export type Animals = Array<{
  /** Name of the animal to guess, with its article: "le lion". */
  name: string;
  /** Different ways of naming the same animal ("le lion", "la lionne"…), the first one being `name`. */
  names: Array<{
    name: string;
    /** Offset of the embedding of this name inside a question: "Est-ce la lionne ?". */
    offset: number;
  }>;
  /** We can have several ways of answering the same question, for variety. */
  answers: Record<string, string[]>;
}>;

export type Questions = Record<
  string,
  Array<{
    question: string;
    /** Offset of the embedding of the question. */
    offset: number;
  }> // Array of similar questions that have the same answer
>;
