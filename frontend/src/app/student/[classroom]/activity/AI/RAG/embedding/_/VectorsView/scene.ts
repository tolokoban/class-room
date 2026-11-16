import { QUESTIONS } from "../data/questions";
import { type Point3, project } from "../projection";
import type { Palette, ScenePoint } from "./types";

export const GROUP_COUNT = Object.keys(QUESTIONS).length;

/** All the wordings of all the questions, placed in 3D. */
export function makeScene(vectors: Float32Array): ScenePoint[] {
  return Object.values(QUESTIONS).flatMap((list, group) =>
    list.map(({ question, offset }) => ({
      position: project(vectors, offset),
      group,
      text: question,
      offset,
    })),
  );
}

/**
 * One color per question, as different as possible from its neighbours (golden angle).
 * The theme has no categorical palette with that many colors.
 */
export function groupColor(group: number): string {
  return `hsl(${(group * 137.508) % 360} 70% 55%)`;
}

/** The colors of the palette texture: one per question, then the probe, then the cube. */
export function paletteColors(palette: Palette): string[] {
  return [
    ...Array.from({ length: GROUP_COUNT }, (_, group) => groupColor(group)),
    palette.probe,
    palette.cube,
  ];
}

/** Horizontal texture coordinate of a color of `paletteColors()`. */
export function paletteU(index: number): number {
  return (index + 0.5) / (GROUP_COUNT + 2);
}

export const PROBE_COLOR_INDEX = GROUP_COUNT;
export const CUBE_COLOR_INDEX = GROUP_COUNT + 1;

/** The 12 edges of the cube that contains the questions, to give a sense of depth. */
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
