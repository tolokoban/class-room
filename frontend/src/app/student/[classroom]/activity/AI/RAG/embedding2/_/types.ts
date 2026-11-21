/**
 * The embeddings are not stored here, but in `data/vectors.dat`:
 * an `offset` is the index of the first value of an embedding in this file,
 * once decoded as a `Float32Array` (see `../../_/vectors.ts`).
 */

export type { Projection } from "../../_/projection";

/**
 * Each story has a version by La Fontaine, and an ancient one: by Ésope,
 * or by Phèdre when Ésope has no version of this story.
 */
export type Author = "esope" | "phedre" | "lafontaine";

/**
 * - `whole`: the whole text of the fable (truncated by the model after 512 tokens).
 * - `summary`: a short summary, in modern French (there are several per fable).
 * - `chunk`: a few verses or sentences of the fable.
 */
export type PassageKind = "whole" | "summary" | "chunk";

export interface Passage {
  kind: PassageKind;
  text: string;
  /** Offset of the embedding of `text`. */
  offset: number;
  /**
   * Chunks only: offsets of the embeddings of two rewordings of `text`, in modern French
   * (see `source/rewordings.ts`). Their text is never shown: when one of them matches,
   * the chunk is shown instead.
   */
  rewordings?: number[];
}

export interface Fable {
  /**
   * Index of the story: the ancient version (Ésope or Phèdre) and La Fontaine's of the same story
   * have the same index, and the same color in the 3D view.
   */
  story: number;
  author: Author;
  title: string;
  /** Link to the full text on Wikisource. */
  url: string;
  /** The whole text, the summaries, then the chunks. */
  passages: Passage[];
}

export type Fables = Fable[];
