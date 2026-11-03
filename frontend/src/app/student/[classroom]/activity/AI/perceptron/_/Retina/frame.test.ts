import { describe, expect, it } from "vitest";

import { FIT, frameImage, normalizeInk } from "./frame";

function bar(column: number): Uint8Array {
  const image = new Uint8Array(400);
  for (let y = 4; y < 16; y++) image[y * 20 + column] = 1;
  return image;
}

/** Bounding box of the ink, as `[x0, y0, x1, y1]` with the max excluded. */
function boundingBox(image: Uint8Array, size: number): number[] {
  const box = [size, size, 0, 0];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!image[y * size + x]) continue;

      box[0] = Math.min(box[0], x);
      box[1] = Math.min(box[1], y);
      box[2] = Math.max(box[2], x + 1);
      box[3] = Math.max(box[3], y + 1);
    }
  }
  return box;
}

describe("normalizeInk", () => {
  it("keeps an image whose ink is the minority", () => {
    expect(Array.from(normalizeInk(bar(10)))).toEqual(Array.from(bar(10)));
  });

  it("inverts an image whose ink is the majority", () => {
    const inverted = bar(10).map((cell) => 1 - cell);
    expect(Array.from(normalizeInk(inverted))).toEqual(Array.from(bar(10)));
  });
});

describe("frameImage", () => {
  it("returns an empty image when there is no ink", () => {
    expect(frameImage(new Uint8Array(6400), 20).every((cell) => cell === 0)).toBe(true);
  });

  it("enlarges and centers a small square found in a corner", () => {
    const image = new Uint8Array(80 * 80);
    for (let y = 2; y < 12; y++) for (let x = 60; x < 70; x++) image[y * 80 + x] = 1;
    const margin = (20 - FIT) / 2;
    expect(boundingBox(frameImage(image, 20), 20)).toEqual([
      margin,
      margin,
      20 - margin,
      20 - margin,
    ]);
  });

  it("keeps the aspect ratio", () => {
    const image = new Uint8Array(80 * 80);
    for (let y = 10; y < 70; y++) for (let x = 30; x < 45; x++) image[y * 80 + x] = 1;
    const [x0, y0, x1, y1] = boundingBox(frameImage(image, 20), 20);
    expect(y1 - y0).toBe(FIT);
    expect(x1 - x0).toBe(FIT / 4);
  });

  it("ignores an isolated pixel far from the digit", () => {
    const image = new Uint8Array(80 * 80);
    for (let y = 20; y < 60; y++) for (let x = 20; x < 60; x++) image[y * 80 + x] = 1;
    image[79 * 80 + 79] = 1;
    const margin = (20 - FIT) / 2;
    expect(boundingBox(frameImage(image, 20), 20)).toEqual([
      margin,
      margin,
      20 - margin,
      20 - margin,
    ]);
  });
});
