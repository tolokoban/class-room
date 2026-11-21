import type { Probe, ScenePoint, ScreenPoint } from "./types";

/** Longer labels are truncated, to keep the view readable. */
const MAX_LABEL_LENGTH = 80;

export interface OverlayOptions {
  scene: ScenePoint[];
  /** Positions of the scene's points on the canvas. */
  screen: ScreenPoint[];
  probe: Probe | null;
  /** Position of the probe on the canvas. */
  probeScreen: ScreenPoint | null;
  /** Index in `scene` of the point under the pointer, or -1. */
  hovered: number;
  background: string;
  text: string;
  /** Device pixel ratio. */
  dpr: number;
}

/**
 * WebGL cannot write text: the labels are drawn on a transparent 2D canvas
 * on top of the 3D view.
 */
export function drawOverlay(ctx: CanvasRenderingContext2D, options: OverlayOptions) {
  const { scene, screen, probe, probeScreen, hovered, dpr } = options;
  const fontSize = 1.5;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textBaseline = "middle";
  ctx.font = `${14 * dpr * fontSize}px dosis, sans-serif`;
  if (probe && probeScreen) {
    for (const { offset, similarity, text } of probe.neighbours) {
      const index = scene.findIndex((point) => point.offset === offset);
      if (index >= 0) label(ctx, `${similarity.toFixed(3)} · ${text}`, screen[index], options);
    }
    const { farthest } = probe;
    const index = farthest ? scene.findIndex((point) => point.offset === farthest.offset) : -1;
    if (farthest && index >= 0)
      label(ctx, `${farthest.similarity.toFixed(3)} · ${farthest.text}`, screen[index], options);
    ctx.font = `bold ${16 * dpr * fontSize}px dosis, sans-serif`;
    label(ctx, `« ${probe.text} »`, probeScreen, options);
    ctx.font = `${14 * dpr * fontSize}px dosis, sans-serif`;
  }
  if (hovered >= 0 && hovered < scene.length)
    label(ctx, scene[hovered].text, screen[hovered], options);
}

/** Text next to a point, on the side where there is more room, outlined to stay readable. */
function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  { x, y }: ScreenPoint,
  { background, text: color, dpr }: OverlayOptions,
) {
  const fullText = `← ${truncate(text)}`;
  const margin = 12 * dpr;
  const tx = x + margin;
  ctx.textAlign = "left";
  ctx.lineJoin = "round";
  ctx.lineWidth = 4 * dpr;
  ctx.strokeStyle = background;
  ctx.strokeText(fullText, tx, y);
  ctx.fillStyle = color;
  ctx.fillText(fullText, tx, y);
}

/** One line of at most `MAX_LABEL_LENGTH` characters, with "…" if it was cut. */
function truncate(text: string): string {
  const line = text.replace(/\s+/g, " ");
  return line.length > MAX_LABEL_LENGTH ? `${line.slice(0, MAX_LABEL_LENGTH - 1)}…` : line;
}
