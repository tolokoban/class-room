import React from "react";

import type { AStar } from "../astar";
import type { Maze } from "../maze";
import { paint } from "./paint";

/** Duration of the growth of the new paths, in milliseconds. */
const DURATION = 200;

/**
 * Draw the maze on the canvas, and redraw it each time the canvas is resized.
 * After each step, the new paths grow during `DURATION` milliseconds.
 */
export function useMazeCanvas(
  maze: Maze,
  astar: AStar,
  previous: AStar | null,
  onAnimationEnd: () => void,
) {
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refOnAnimationEnd = React.useRef(onAnimationEnd);
  refOnAnimationEnd.current = onAnimationEnd;
  React.useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    let progress = previous ? 0 : 1;
    const draw = () => paint(canvas, { maze, astar, previous, progress });
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    let frame = 0;
    if (previous) {
      const start = performance.now();
      const animate = (time: number) => {
        progress = Math.min(1, (time - start) / DURATION);
        draw();
        if (progress < 1) frame = requestAnimationFrame(animate);
        else refOnAnimationEnd.current();
      };
      frame = requestAnimationFrame(animate);
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [maze, astar, previous]);
  return refCanvas;
}
