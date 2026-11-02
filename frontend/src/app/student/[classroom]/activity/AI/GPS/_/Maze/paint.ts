import { type AStar, getBestCandidate, getClosestCandidate, getPath } from "../astar";
import type { Maze } from "../maze";
import { getSegments } from "./growth";

interface Grid {
  ctx: CanvasRenderingContext2D;
  width: number;
  /** Size of a cell, in pixels. */
  size: number;
  left: number;
  top: number;
}

export interface Frame {
  maze: Maze;
  astar: AStar;
  /** State before the last step: the new segments grow from it. */
  previous: AStar | null;
  /** Between 0 (start of the growth) and 1 (new segments fully drawn). */
  progress: number;
}

export function paint(canvas: HTMLCanvasElement, frame: Frame) {
  const { maze } = frame;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = maze;
  const ratio = window.devicePixelRatio;
  canvas.width = Math.round(canvas.clientWidth * ratio);
  canvas.height = Math.round(canvas.clientHeight * ratio);
  // Biggest integer cell size that fits, to keep sharp edges.
  const size = Math.max(1, Math.floor(Math.min(canvas.width / width, canvas.height / height)));
  const grid: Grid = {
    ctx,
    width,
    size,
    left: Math.floor((canvas.width - size * width) / 2),
    top: Math.floor((canvas.height - size * height) / 2),
  };
  const colors = getColors(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paintCells(grid, maze, colors);
  paintCircle(grid, maze.start, colors.start);
  paintCircle(grid, maze.target, colors.target);
  paintPaths(grid, frame, colors);
}

function paintCells(grid: Grid, { width, height, walls, highways }: Maze, colors: Colors) {
  const { ctx, size, left, top } = grid;
  ctx.fillStyle = colors.empty;
  ctx.fillRect(left, top, size * width, size * height);
  const fillCells = (cells: boolean[], color: string) => {
    ctx.fillStyle = color;
    cells.forEach((filled, cell) => {
      if (filled) {
        ctx.fillRect(
          left + size * (cell % width),
          top + size * Math.floor(cell / width),
          size,
          size,
        );
      }
    });
  };
  fillCells(walls, colors.wall);
  fillCells(highways, colors.highway);
}

function paintCircle(grid: Grid, cell: number, color: string) {
  const { ctx, size } = grid;
  const [x, y] = center(grid, cell);
  ctx.fillStyle = color;
  ctx.beginPath();
  // Half of the diagonal of a cell.
  ctx.arc(x, y, (size * Math.SQRT2) / 2, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * All the candidate paths (black border and gray inside), then the closest one to the target
 * in blue, and the best one in red.
 * During the animation, the red path is the one that has just been explored.
 */
function paintPaths(grid: Grid, frame: Frame, colors: Colors) {
  const { ctx, size } = grid;
  const { maze, astar, previous, progress } = frame;
  const growing = previous !== null && progress < 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (const { from, to, fraction } of getSegments(frame)) {
    if (fraction <= 0) continue;

    const [x0, y0] = center(grid, from);
    const [x1, y1] = center(grid, to);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + fraction * (x1 - x0), y0 + fraction * (y1 - y0));
  }
  stroke(ctx, colors.pathBorder, 0.5 * size);
  stroke(ctx, colors.path, 0.3 * size);
  const state = growing ? previous : astar;
  const best = getBestCandidate(maze, state);
  const closest = getClosestCandidate(maze, state);
  if (closest !== best) paintPath(grid, astar, closest, colors.closest);
  paintPath(grid, astar, best, colors.best);
}

function paintPath(grid: Grid, astar: AStar, tip: number | undefined, color: string) {
  if (tip === undefined) return;

  const path = getPath(astar, tip);
  grid.ctx.beginPath();
  grid.ctx.moveTo(...center(grid, path[0]));
  // A single cell still gives a round dot.
  for (const cell of path) grid.ctx.lineTo(...center(grid, cell));
  stroke(grid.ctx, color, 0.3 * grid.size);
}

function stroke(ctx: CanvasRenderingContext2D, color: string, lineWidth: number) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function center({ width, size, left, top }: Grid, cell: number): [number, number] {
  return [left + size * ((cell % width) + 0.5), top + size * (Math.floor(cell / width) + 0.5)];
}

type Colors = ReturnType<typeof getColors>;

/**
 * The colors are defined as CSS variables in `page.module.css`.
 */
function getColors(canvas: HTMLCanvasElement) {
  const style = getComputedStyle(canvas);
  const get = (name: string) => style.getPropertyValue(`--maze-${name}`).trim();
  return {
    empty: get("empty"),
    wall: get("wall"),
    highway: get("highway"),
    start: get("start"),
    target: get("target"),
    pathBorder: get("path-border"),
    path: get("path"),
    best: get("best"),
    closest: get("closest"),
  };
}
