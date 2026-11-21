import type { Point3 } from "../projection";

/** A point of the scene close to the student's sentence. */
export interface Neighbour {
  /** What to write next to the point. */
  text: string;
  /** Offset of its embedding in `vectors.dat`: it identifies the point of the scene. */
  offset: number;
  similarity: number;
}

/** The last sentence of the student, to show in the 3D view. */
export interface Probe {
  text: string;
  /** Normalized embedding of `text`. */
  vector: number[];
  /** The closest points, the closest first. They are linked to the probe in green. */
  neighbours: Neighbour[];
  /** The farthest point, linked to the probe in red. */
  farthest: Neighbour | null;
}

/** A point of the 3D view: one embedding. */
export interface ScenePoint {
  position: Point3;
  /** Points of the same group have the same color (see `MAX_GROUPS`). */
  group: number;
  /** Shown when the pointer is over the point. */
  text: string;
  /** Offset of the embedding in `vectors.dat`. */
  offset: number;
  /** Factor applied to the radius of the sphere. Default to 1. */
  size?: number;
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
