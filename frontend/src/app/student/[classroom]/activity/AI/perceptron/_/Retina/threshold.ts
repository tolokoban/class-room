/** Fraction of the lightest (and darkest) pixels averaged to find the threshold. */
const EXTREMES = 0.05;

/**
 * Luminance of each pixel, between 0 and 1.
 * @param rgba Pixels as returned by `gl.readPixels()` with `RGBA` / `UNSIGNED_BYTE`.
 */
export function computeLuminances(rgba: Uint8Array): Float32Array {
  const luminances = new Float32Array(rgba.length / 4);
  for (let i = 0; i < luminances.length; i++) {
    const j = i * 4;
    luminances[i] = (0.299 * rgba[j] + 0.587 * rgba[j + 1] + 0.114 * rgba[j + 2]) / 255;
  }
  return luminances;
}

/**
 * The threshold is halfway between the average of the `EXTREMES` lightest pixels
 * and the average of the `EXTREMES` darkest ones (5% of the pixels each).
 */
export function computeThreshold(luminances: Float32Array): number {
  const sorted = luminances.slice().sort();
  if (sorted.length === 0) return 0.5;

  const count = Math.max(1, Math.round(sorted.length * EXTREMES));
  let low = 0;
  let high = 0;
  for (let i = 0; i < count; i++) {
    low += sorted[i];
    high += sorted[sorted.length - 1 - i];
  }
  return (low + high) / (2 * count);
}

/**
 * Dark cells (luminance not above the threshold) become 1, light ones 0.
 * The luminances come from `gl.readPixels()`, whose first row is at the bottom,
 * so the rows of `image` are flipped to start from the top.
 */
export function binarize(luminances: Float32Array, threshold: number, image: Uint8Array) {
  const size = Math.round(Math.sqrt(image.length));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      image[y * size + x] = luminances[(size - 1 - y) * size + x] > threshold ? 0 : 1;
    }
  }
}
