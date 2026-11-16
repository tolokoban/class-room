import { PROJECTION } from "./data/projection";
import { EMBEDDING_SIZE } from "./model";

export type Point3 = [x: number, y: number, z: number];

/**
 * Position of an embedding in the 3D view (see `lda.ts`).
 * The questions span exactly [-1, +1] on each axis.
 * @param offset Where the embedding starts in `vector`.
 */
export function project(vector: ArrayLike<number>, offset = 0): Point3 {
  const { mean, axes, center } = PROJECTION;
  const [x, y, z] = axes.map((axis, k) => {
    let sum = -center[k];
    for (let i = 0; i < EMBEDDING_SIZE; i++) sum += (vector[offset + i] - mean[i]) * axis[i];
    return sum;
  });
  return [x, y, z];
}
