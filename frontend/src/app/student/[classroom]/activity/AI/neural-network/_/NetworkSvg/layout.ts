/**
 * Geometry of the SVG, in viewBox units.
 */

export const WIDTH = 800;
export const HEIGHT = 384;
export const RADIUS = 28;
export const BOX_WIDTH = 60;
export const BOX_HEIGHT = 22;
/** Space between a neuron and its coefficient boxes. */
export const GAP = 6;

export const INPUT_X = 70;
export const HIDDEN_X = 400;
export const OUTPUT_X = 690;

export interface Point {
  x: number;
  y: number;
}

export function inputY(j: number): number {
  return 91 + j * 100;
}

export function hiddenY(k: number): number {
  return 50 + k * 94;
}

export function outputY(c: number): number {
  return hiddenY(c);
}

/**
 * Top-left corner of the box of the `j`-th input coefficient of hidden neuron `k`.
 */
export function hiddenInBox(k: number, j: number): Point {
  return {
    x: HIDDEN_X - RADIUS - GAP - BOX_WIDTH,
    y: hiddenY(k) - 1.5 * BOX_HEIGHT + j * BOX_HEIGHT,
  };
}

/**
 * Top-left corner of the box of the coefficient from hidden neuron `k` to output `c`.
 */
export function hiddenOutBox(k: number, c: number): Point {
  return {
    x: HIDDEN_X + RADIUS + GAP,
    y: hiddenY(k) - 2 * BOX_HEIGHT + c * BOX_HEIGHT,
  };
}

export function formatCoef(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(2)}`;
}
