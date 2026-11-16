import type { Neighbour } from "../game";
import type { Point3 } from "../projection";

/** The last sentence of the student, to show in the 3D view. */
export interface Probe {
  text: string;
  /** Normalized embedding of `text`. */
  vector: number[];
  /** The closest questions, the closest first. */
  neighbours: Neighbour[];
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

export interface Camera {
  /** Rotation around the vertical axis, in radians. */
  yaw: number;
  /** Rotation around the horizontal axis, in radians. */
  pitch: number;
}

/** A point once projected on the canvas, in pixels. */
export interface ScreenPoint {
  x: number;
  y: number;
  /** Greater when closer to the viewer. */
  depth: number;
  /** Perspective factor: greater than 1 when close to the viewer. */
  scale: number;
}
