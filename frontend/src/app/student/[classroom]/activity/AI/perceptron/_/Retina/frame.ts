/** Number of cells of the longest side of the framed digit. The remaining cells make a margin. */
export const FIT = 16;
/** Fraction of the ink ignored on each side when computing the bounding box, to skip isolated pixels. */
const OUTLIERS = 0.01;
/** Minimal fraction of ink in the area of a cell for this cell to be considered as ink. */
const COVERAGE = 0.3;

/**
 * The perceptron can only learn shapes of one color. So we decide that the ink
 * is the color of the minority of the cells, and we set it to 1.
 * @returns A new image.
 */
export function normalizeInk(image: Uint8Array): Uint8Array {
  const ink = image.reduce((sum, cell) => sum + cell, 0);
  const result = new Uint8Array(image);
  if (ink * 2 <= image.length) return result;

  return result.map((cell) => 1 - cell);
}

/**
 * Crop the ink (cells set to 1) of a square image to its bounding box,
 * scale it to make its longest side `FIT` cells long (keeping its aspect ratio),
 * and center it in a square of `size`×`size` cells.
 * @param output Where to write the result. A new array is created if omitted.
 */
export function frameImage(
  image: Uint8Array,
  size: number,
  output: Uint8Array = new Uint8Array(size * size),
): Uint8Array {
  output.fill(0);
  const side = Math.round(Math.sqrt(image.length));
  const columns = new Uint32Array(side);
  const rows = new Uint32Array(side);
  let ink = 0;
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      if (!image[y * side + x]) continue;

      columns[x]++;
      rows[y]++;
      ink++;
    }
  }
  if (ink === 0) return output;

  const [x0, x1] = computeBounds(columns, ink);
  const [y0, y1] = computeBounds(rows, ink);
  // Number of pixels of the source image in one cell of the output.
  const scale = Math.max(x1 - x0, y1 - y0) / FIT;
  const centerX = (x0 + x1) / 2;
  const centerY = (y0 + y1) / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const left = centerX + (x - size / 2) * scale;
      const top = centerY + (y - size / 2) * scale;
      const coverage = computeCoverage(image, side, left, top, scale);
      output[y * size + x] = coverage >= COVERAGE ? 1 : 0;
    }
  }
  return output;
}

/**
 * @returns The interval `[min, max[` of the ink along one axis, without the `OUTLIERS`.
 */
function computeBounds(histogram: Uint32Array, ink: number): [number, number] {
  const skip = ink * OUTLIERS;
  let min = 0;
  for (let sum = histogram[0]; sum <= skip; sum += histogram[min]) min++;
  let max = histogram.length - 1;
  for (let sum = histogram[max]; sum <= skip; sum += histogram[max]) max--;
  return [min, max + 1];
}

/**
 * Fraction of the pixels whose top left corner is in the square (`left`, `top`, `scale`) that are ink.
 * At least one pixel is taken into account, and the pixels outside the image count as background.
 */
function computeCoverage(
  image: Uint8Array,
  side: number,
  left: number,
  top: number,
  scale: number,
): number {
  const x0 = Math.floor(left);
  const y0 = Math.floor(top);
  const x1 = Math.max(x0 + 1, Math.floor(left + scale));
  const y1 = Math.max(y0 + 1, Math.floor(top + scale));
  let ink = 0;
  for (let y = Math.max(0, y0); y < Math.min(side, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(side, x1); x++) {
      ink += image[y * side + x];
    }
  }
  return ink / ((x1 - x0) * (y1 - y0));
}
