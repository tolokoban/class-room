import { project } from "../../_/projection";
import type { ScenePoint } from "../../_/VectorsView";
import { PROJECTION } from "./data/projection";
import { QUESTIONS } from "./data/questions";

/**
 * All the wordings of all the questions, placed in 3D, one color per question.
 * The animals' names are not shown: 91 groups would be too crowded.
 */
export function makeScene(vectors: Float32Array): ScenePoint[] {
  return Object.values(QUESTIONS).flatMap((list, group) =>
    list.map(({ question, offset }) => ({
      position: project(PROJECTION, vectors, offset),
      group,
      text: question,
      offset,
    })),
  );
}
