import { EMBEDDING_SIZE } from "./model";

/**
 * `vectors.dat` holds all the precomputed embeddings, one after the other,
 * as 16 bits floats in little endian (see `generate.mts`).
 * We decode them by hand, because `Float16Array` is not available in all browsers yet.
 */
export function decodeVectors(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer);
  const values = new Float32Array(buffer.byteLength / 2);
  for (let i = 0; i < values.length; i++) {
    values[i] = float16ToFloat32(view.getUint16(i * 2, true));
  }
  return values;
}

function float16ToFloat32(bits: number): number {
  const sign = bits & 0x8000 ? -1 : 1;
  const exponent = (bits >> 10) & 0x1f;
  const fraction = bits & 0x3ff;
  // Subnormal numbers.
  if (exponent === 0) return sign * 2 ** -14 * (fraction / 1024);
  // Infinity and NaN.
  if (exponent === 0x1f) return fraction ? NaN : sign * Infinity;

  return sign * 2 ** (exponent - 15) * (1 + fraction / 1024);
}

/**
 * Cosine similarity between `vector` and the embedding starting at `offset` in `vectors`.
 * All the vectors are normalized, so the dot product is the cosine similarity.
 */
export function similarity(
  vector: ArrayLike<number>,
  vectors: Float32Array,
  offset: number,
): number {
  let sum = 0;
  for (let i = 0; i < EMBEDDING_SIZE; i++) sum += vector[i] * vectors[offset + i];
  return sum;
}
