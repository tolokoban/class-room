import React from "react";

import { project } from "../projection";
import { type Palette, render, type RenderOptions } from "./render";
import { makeScene } from "./scene";
import type { Camera, Probe, ScreenPoint } from "./types";

/** Radians per frame. */
const AUTO_ROTATION_SPEED = 0.003;
/** Radians per pixel dragged. */
const DRAG_SPEED = 0.01;
/** Max distance, in CSS pixels, between the mouse and a point to show its text. */
const HOVER_RADIUS = 10;

type SceneData = Pick<RenderOptions, "scene" | "probe" | "probePoint">;

interface ViewState {
  camera: Camera;
  /** Auto rotation stops as soon as the student rotates the view by hand. */
  userRotated: boolean;
  pointerInside: boolean;
  drag: { x: number; y: number } | null;
  hovered: number;
  /** Positions on the canvas of the last rendered points. */
  screen: ScreenPoint[];
  dirty: boolean;
}

export function useVectorsView(vectors: Float32Array | null, probe: Probe | null) {
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const scene = React.useMemo(() => (vectors ? makeScene(vectors) : []), [vectors]);
  const probePoint = React.useMemo(() => (probe ? project(probe.vector) : null), [probe]);
  const refState = React.useRef<ViewState>({
    camera: { yaw: 0.6, pitch: 0.35 },
    userRotated: false,
    pointerInside: false,
    drag: null,
    hovered: -1,
    screen: [],
    dirty: true,
  });
  const refData = React.useRef<SceneData>({ scene, probe, probePoint });
  React.useEffect(() => {
    refData.current = { scene, probe, probePoint };
    refState.current.dirty = true;
  }, [scene, probe, probePoint]);
  useRenderLoop(refCanvas, refState, refData);
  return { refCanvas, ...usePointerHandlers(refCanvas, refState) };
}

function useRenderLoop(
  refCanvas: React.RefObject<HTMLCanvasElement | null>,
  refState: React.RefObject<ViewState>,
  refData: React.RefObject<SceneData>,
) {
  React.useEffect(() => {
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const canvas = refCanvas.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const state = refState.current;
      const dpr = window.devicePixelRatio || 1;
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        state.dirty = true;
      }
      const rotating = !state.userRotated && !state.pointerInside;
      if (rotating) state.camera.yaw += AUTO_ROTATION_SPEED;
      if (!rotating && !state.dirty) return;

      state.dirty = false;
      state.screen = render(ctx, {
        ...refData.current,
        camera: state.camera,
        palette: readPalette(canvas),
        hovered: state.hovered,
        dpr,
      });
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [refCanvas, refState, refData]);
}

function usePointerHandlers(
  refCanvas: React.RefObject<HTMLCanvasElement | null>,
  refState: React.RefObject<ViewState>,
) {
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    refState.current.drag = { x: event.clientX, y: event.clientY };
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const state = refState.current;
    state.pointerInside = true;
    state.dirty = true;
    if (state.drag) {
      const { camera } = state;
      camera.yaw += (event.clientX - state.drag.x) * DRAG_SPEED;
      camera.pitch += (event.clientY - state.drag.y) * DRAG_SPEED;
      camera.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.pitch));
      state.drag = { x: event.clientX, y: event.clientY };
      state.userRotated = true;
      state.hovered = -1;
      return;
    }
    state.hovered = findHovered(refCanvas.current, state.screen, event);
  };
  const handlePointerUp = () => {
    refState.current.drag = null;
  };
  const handlePointerLeave = () => {
    const state = refState.current;
    state.pointerInside = false;
    state.hovered = -1;
    state.dirty = true;
  };
  return { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerLeave };
}

function findHovered(
  canvas: HTMLCanvasElement | null,
  screen: ScreenPoint[],
  event: React.PointerEvent,
): number {
  if (!canvas) return -1;

  const rect = canvas.getBoundingClientRect();
  const dpr = canvas.width / rect.width;
  const x = (event.clientX - rect.left) * dpr;
  const y = (event.clientY - rect.top) * dpr;
  let best = -1;
  let bestDistance = HOVER_RADIUS * dpr;
  screen.forEach((point, index) => {
    const distance = Math.hypot(point.x - x, point.y - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}

function readPalette(element: HTMLElement): Palette {
  const style = getComputedStyle(element);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return {
    background: read("--theme-color-neutral-1"),
    text: read("--theme-color-on-neutral-1"),
    probe: read("--theme-color-secondary-5"),
  };
}
