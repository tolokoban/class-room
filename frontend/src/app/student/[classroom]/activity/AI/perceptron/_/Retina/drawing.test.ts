import { describe, expect, it } from "vitest";

import { createDrawing } from "./drawing";
import { FIT } from "./frame";

function count(image: Uint8Array): number {
  return image.reduce((sum, value) => sum + value, 0);
}

describe("createDrawing()", () => {
  // The side neighbours are covered at about 54%, the diagonal ones at less than 10%.
  it("should paint a plus with a disk centered on a cell", () => {
    const drawing = createDrawing(5);
    const image = new Uint8Array(25);
    drawing.stamp(2.5, 2.5);
    drawing.render(image);
    // prettier-ignore
    expect([...image]).toEqual([
      0, 0, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 0, 0,
    ]);
  });

  it("should paint a 2×2 square with a disk centered on a corner", () => {
    const drawing = createDrawing(4);
    const image = new Uint8Array(16);
    drawing.stamp(2, 2);
    drawing.render(image);
    // prettier-ignore
    expect([...image]).toEqual([
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0,
    ]);
  });

  it("should paint a continuous line along a stroke", () => {
    const drawing = createDrawing(20);
    const image = new Uint8Array(400);
    drawing.stamp(2.5, 10.5);
    drawing.stroke(2.5, 10.5, 17.5, 10.5);
    drawing.render(image);
    for (let x = 2; x <= 17; x++) expect(image[10 * 20 + x]).toBe(1);
    expect(image[8 * 20 + 10]).toBe(0);
  });

  it("should erase everything with clear()", () => {
    const drawing = createDrawing(20);
    const image = new Uint8Array(400);
    drawing.stamp(10, 10);
    drawing.clear();
    drawing.render(image);
    expect(count(image)).toBe(0);
  });

  it("should keep the loaded image", () => {
    const drawing = createDrawing(3);
    const source = new Uint8Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    const image = new Uint8Array(9);
    drawing.load(source);
    drawing.render(image);
    expect([...image]).toEqual([...source]);
  });

  it("should frame a small drawing in a corner, and keep drawing on the framed version", () => {
    const drawing = createDrawing(20);
    const image = new Uint8Array(400);
    drawing.stamp(3, 3);
    drawing.stroke(3, 3, 3, 8);
    drawing.frame(image);
    const rows = [...Array(20).keys()].filter((y) =>
      image.slice(y * 20, y * 20 + 20).some(Boolean),
    );
    // The longest side is now FIT cells long, and centered.
    expect(rows.length).toBeGreaterThanOrEqual(FIT - 1);
    expect(rows.length).toBeLessThanOrEqual(FIT + 1);
    expect(Math.abs(rows[0] + rows.at(-1)! + 1 - 20)).toBeLessThanOrEqual(1);
    const framed = new Uint8Array(image);
    drawing.render(image);
    expect([...image]).toEqual([...framed]);
  });
});
