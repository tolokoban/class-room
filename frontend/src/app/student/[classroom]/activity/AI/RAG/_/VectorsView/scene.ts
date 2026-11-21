import type { Point3 } from "../projection";
import type { Palette } from "./types";

/**
 * Maximum number of groups of points, each one with its own color.
 * The palette texture has a fixed size, so it does not depend on the scene.
 */
export const MAX_GROUPS = 254;

/**
 * One color per group, as different as possible from its neighbours (golden angle).
 * The theme has no categorical palette with that many colors.
 */
export function groupColor(group: number): string {
  return `hsl(${(group * 137.508) % 360} 70% 55%)`;
}

/** The colors of the palette texture: one per group, then the probe, then the cube. */
export function paletteColors(palette: Palette): string[] {
  return [
    ...Array.from({ length: MAX_GROUPS }, (_, group) => groupColor(group)),
    palette.probe,
    palette.cube,
  ];
}

/** Horizontal texture coordinate of a color of `paletteColors()`. */
export function paletteU(index: number): number {
  return (index + 0.5) / (MAX_GROUPS + 2);
}

export const PROBE_COLOR_INDEX = MAX_GROUPS;
export const CUBE_COLOR_INDEX = MAX_GROUPS + 1;

/** The 12 edges of the cube that contains the points, to give a sense of depth. */
export const CUBE_EDGES: Array<[Point3, Point3]> = (() => {
  const corners: Point3[] = [];
  for (const x of [-1, 1])
    for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push([x, y, z]);
  return corners.flatMap((a, i) =>
    corners
      .slice(i + 1)
      .filter((b) => a.filter((value, k) => value !== b[k]).length === 1)
      .map((b): [Point3, Point3] => [a, b]),
  );
})();

export function readPalette(element: HTMLElement): Palette {
  const style = getComputedStyle(element);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const background = "#000";
  const text = "#fff";
  return {
    background,
    text,
    probe: read("--theme-color-secondary-5"),
    cube: "#777",
  };
}
