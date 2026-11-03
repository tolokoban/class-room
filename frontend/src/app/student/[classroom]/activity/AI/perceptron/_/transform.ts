/**
 * Random scale, rotation and translation of a square binary image,
 * around its center, with nearest neighbour sampling.
 * The cells coming from outside the image are set to 0.
 */
export function transformImage(image: Uint8Array, random: () => number = Math.random): Uint8Array {
  const size = Math.round(Math.sqrt(image.length));
  const between = (min: number, max: number) => min + (max - min) * random();
  const scaleX = between(0.9, 1.1);
  const scaleY = between(0.9, 1.1);
  const angle = (between(-20, 20) * Math.PI) / 180;
  const translateX = between(-0.1, 0.1) * size;
  const translateY = between(-0.1, 0.1) * size;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const center = (size - 1) / 2;
  const result = new Uint8Array(image.length);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Inverse transformation: where does this destination cell come from?
      const u = x - center - translateX;
      const v = y - center - translateY;
      const sx = Math.round((cos * u + sin * v) / scaleX + center);
      const sy = Math.round((-sin * u + cos * v) / scaleY + center);
      if (sx < 0 || sy < 0 || sx >= size || sy >= size) continue;

      result[y * size + x] = image[sy * size + sx];
    }
  }
  return result;
}
