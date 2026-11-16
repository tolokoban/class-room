import type { Neighbour } from "../game";
import type { Point3 } from "../projection";

/** The last sentence of the student, to show in the 3D view. */
export interface Probe {
  text: string;
  /** Normalized embedding of `text`. */
  vector: number[];
  /** The closest questions, the closest first. */
  neighbours: Neighbour[];
  /** The question that is the farthest. */
  farthest: Neighbour | null;
}

/** A wording of a question, in the 3D view. */
export interface ScenePoint {
  position: Point3;
  /** Index of the question this wording belongs to. */
  group: number;
  text: string;
  /** Offset of the embedding in `vectors.dat`. */
  offset: number;
}

/** A point once projected on the canvas, in physical pixels. */
export interface ScreenPoint {
  x: number;
  y: number;
}

/** Colors of the view, as CSS colors, read from the theme. */
export interface Palette {
  background: string;
  text: string;
  probe: string;
  cube: string;
}
