import { Theme } from "@tolokoban/ui";

import type { AStar } from "../astar";
import type { Maze as MazeData } from "../maze";
import { useMazeCanvas } from "./hooks";

import Styles from "./Maze.module.css";

const $ = Theme.classNames;

export interface MazeProps {
  className?: string;
  maze: MazeData;
  astar: AStar;
  /** State before the last step: the new paths grow from it. */
  previous: AStar | null;
  onAnimationEnd(): void;
}

export function Maze({ className, maze, astar, previous, onAnimationEnd }: MazeProps) {
  const refCanvas = useMazeCanvas(maze, astar, previous, onAnimationEnd);
  return (
    <canvas
      ref={refCanvas}
      className={$.join(className, Styles.maze)}
      style={{ aspectRatio: `${maze.width} / ${maze.height}` }}
    />
  );
}
