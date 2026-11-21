import { project } from "../../_/projection";
import type { Neighbour, ScenePoint } from "../../_/VectorsView";
import { FABLES } from "./data/fables";
import { PROJECTION } from "./data/projection";
import type { FableMatch } from "./search";
import type { Author, Fable, Passage, PassageKind } from "./types";

/** The chunks are drawn with spheres half the size of the whole texts and the summaries. */
const CHUNK_SIZE = 0.5;

/** Translated names, to write the labels of the 3D view. */
export type Labels = Record<Author | PassageKind, string>;

/**
 * All the passages of all the fables, placed in 3D, one color per story:
 * both versions of a story (Ésope or Phèdre, and La Fontaine) have the same color.
 */
export function makeScene(vectors: Float32Array, labels: Labels): ScenePoint[] {
  return FABLES.flatMap((fable) =>
    fable.passages.map((passage) => ({
      position: project(PROJECTION, vectors, passage.offset),
      group: fable.story,
      text: `${fableLabel(fable, labels)} · ${labels[passage.kind]} : ${passage.text}`,
      offset: passage.offset,
      size: passage.kind === "chunk" ? CHUNK_SIZE : 1,
    })),
  );
}

/** The closest passage of a fable, to link it to the student's sentence in the 3D view. */
export function toNeighbour({ fable, passage, similarity }: FableMatch, labels: Labels): Neighbour {
  return { text: passageLabel(fable, passage, labels), offset: passage.offset, similarity };
}

/** "Title (Author)", to name a fable in the 3D view. */
function fableLabel({ title, author }: Fable, labels: Labels): string {
  return `${title} (${labels[author]})`;
}

/** "Title (Author) · kind": the text is not included, because labels must stay short. */
function passageLabel(fable: Fable, { kind }: Passage, labels: Labels): string {
  return `${fableLabel(fable, labels)} · ${labels[kind]}`;
}
