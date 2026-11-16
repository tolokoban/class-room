import type { Probe, ScenePoint, ScreenPoint } from "./types";

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
    for (const { offset, similarity, question } of probe.neighbours) {
      const index = scene.findIndex((point) => point.offset === offset);
      if (index >= 0) label(ctx, `${similarity.toFixed(3)} · ${question}`, screen[index], options);
    }
    const { farthest } = probe;
    const index = farthest ? scene.findIndex((point) => point.offset === farthest.offset) : -1;
    if (farthest && index >= 0)
      label(
        ctx,
        `${farthest.similarity.toFixed(3)} · ${farthest.question}`,
        screen[index],
        options,
      );
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
  const fullText = `← ${text}`;
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
