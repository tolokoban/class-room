import type { Point3 } from "../projection";
import { CUBE_EDGES, groupColor, toScreen } from "./scene";
import type { Camera, Probe, ScenePoint, ScreenPoint } from "./types";

export interface Palette {
  background: string;
  text: string;
  probe: string;
}

export interface RenderOptions {
  scene: ScenePoint[];
  probe: Probe | null;
  /** Position of the probe in 3D. */
  probePoint: Point3 | null;
  camera: Camera;
  palette: Palette;
  /** Index in `scene` of the point under the mouse, or -1. */
  hovered: number;
  /** Device pixel ratio. */
  dpr: number;
}

/**
 * @returns The positions of the scene's points on the canvas, to find the hovered one.
 */
export function render(ctx: CanvasRenderingContext2D, options: RenderOptions): ScreenPoint[] {
  const { scene, probe, probePoint, camera, palette, hovered, dpr } = options;
  const { width, height } = ctx.canvas;
  const screen = (point: Point3) => toScreen(point, camera, width, height);
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${14 * dpr}px dosis, sans-serif`;
  ctx.textBaseline = "middle";
  drawCube(ctx, screen, palette, dpr);
  const points = scene.map(({ position }) => screen(position));
  drawPoints(ctx, scene, points, dpr);
  if (probe && probePoint) drawProbe(ctx, options, screen(probePoint), points);
  if (hovered >= 0 && hovered < scene.length) {
    const point = points[hovered];
    circle(ctx, point.x, point.y, 6 * dpr * point.scale, groupColor(scene[hovered].group));
    label(ctx, scene[hovered].text, point, palette, dpr);
  }
  return points;
}

function drawCube(
  ctx: CanvasRenderingContext2D,
  screen: (point: Point3) => ScreenPoint,
  palette: Palette,
  dpr: number,
) {
  ctx.strokeStyle = palette.text;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = dpr;
  ctx.beginPath();
  for (const [a, b] of CUBE_EDGES) {
    const pa = screen(a);
    const pb = screen(b);
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** The farthest points are drawn first, and paler. */
function drawPoints(
  ctx: CanvasRenderingContext2D,
  scene: ScenePoint[],
  points: ScreenPoint[],
  dpr: number,
) {
  const order = points.map((_, index) => index).sort((a, b) => points[a].depth - points[b].depth);
  for (const index of order) {
    const { x, y, depth, scale } = points[index];
    ctx.globalAlpha = Math.min(1, Math.max(0.25, 0.6 + depth * 0.3));
    circle(ctx, x, y, 3.5 * dpr * scale, groupColor(scene[index].group));
  }
  ctx.globalAlpha = 1;
}

/** The student's sentence, linked to its closest questions. */
function drawProbe(
  ctx: CanvasRenderingContext2D,
  { scene, probe, palette, dpr }: RenderOptions,
  origin: ScreenPoint,
  points: ScreenPoint[],
) {
  if (!probe) return;

  const targets = probe.neighbours.map((neighbour) => {
    const index = scene.findIndex(({ offset }) => offset === neighbour.offset);
    return { neighbour, index, point: points[index] };
  });
  ctx.strokeStyle = palette.probe;
  ctx.lineWidth = 2 * dpr;
  for (const { point } of targets) {
    if (!point) continue;

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
  for (const { neighbour, index, point } of targets) {
    if (!point) continue;

    circle(ctx, point.x, point.y, 6 * dpr * point.scale, groupColor(scene[index].group));
    const text = `${neighbour.similarity.toFixed(3)} · ${neighbour.question}`;
    label(ctx, text, point, palette, dpr);
  }
  circle(ctx, origin.x, origin.y, 8 * dpr * origin.scale, palette.probe);
  ctx.font = `bold ${16 * dpr}px dosis, sans-serif`;
  label(ctx, `« ${probe.text} »`, origin, palette, dpr);
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

/** Text next to a point, on the side where there is more room, outlined to stay readable. */
function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  { x, y }: ScreenPoint,
  palette: Palette,
  dpr: number,
) {
  const left = x > ctx.canvas.width / 2;
  const margin = 10 * dpr;
  ctx.textAlign = left ? "right" : "left";
  const tx = left ? x - margin : x + margin;
  ctx.lineJoin = "round";
  ctx.lineWidth = 4 * dpr;
  ctx.strokeStyle = palette.background;
  ctx.strokeText(text, tx, y);
  ctx.fillStyle = palette.text;
  ctx.fillText(text, tx, y);
}
