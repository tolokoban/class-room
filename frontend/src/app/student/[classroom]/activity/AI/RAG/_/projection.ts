import { EMBEDDING_SIZE } from "./model";

export type Point3 = [x: number, y: number, z: number];

/**
 * Linear projection of an embedding into the 3D view:
 * `coordinate[k] = (vector - mean) · axes[k] - center[k]`.
 * Computed by a Fisher LDA (see `lda.ts`) when the data is generated.
 */
export interface Projection {
  mean: number[];
  axes: [number[], number[], number[]];
  /** Middle of the cloud, so that it is centered in the view. */
  center: [number, number, number];
}

/**
 * Position of an embedding in the 3D view (see `lda.ts`).
 * The vectors used to fit the projection span exactly [-1, +1] on each axis.
 * @param offset Where the embedding starts in `vector`.
 */
export function project(
  { mean, axes, center }: Projection,
  vector: ArrayLike<number>,
  offset = 0,
): Point3 {
  const [x, y, z] = axes.map((axis, k) => {
    let sum = -center[k];
    for (let i = 0; i < EMBEDDING_SIZE; i++) sum += (vector[offset + i] - mean[i]) * axis[i];
    return sum;
  });
  return [x, y, z];
}
