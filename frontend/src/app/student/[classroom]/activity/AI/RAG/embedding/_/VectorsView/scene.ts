import { QUESTIONS } from "../data/questions";
import { type Point3, project } from "../projection";
import type { Camera, ScenePoint, ScreenPoint } from "./types";

/** Distance from the camera to the center of the cube, in cube half-sides. */
const CAMERA_DISTANCE = 6;
/** Size of a cube half-side, relative to the smallest side of the canvas. */
const ZOOM = 0.2;

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

export function toScreen(
  [x, y, z]: Point3,
  { yaw, pitch }: Camera,
  width: number,
  height: number,
): ScreenPoint {
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
  const scale = CAMERA_DISTANCE / (CAMERA_DISTANCE - z2);
  const unit = Math.min(width, height) * ZOOM * scale;
  return { x: width / 2 + x1 * unit, y: height / 2 - y2 * unit, depth: z2, scale };
}

/** One color per question, as different as possible from its neighbours (golden angle). */
export function groupColor(group: number): string {
  return `hsl(${(group * 137.508) % 360} 70% 55%)`;
}

/** The 8 corners of the cube and its 12 edges, to give a sense of depth. */
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
