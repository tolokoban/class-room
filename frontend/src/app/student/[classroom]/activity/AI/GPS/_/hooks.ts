import React from "react";

import { type AStar, createAStar, getPath, getPathCost, stepAStar } from "./astar";
import { createMaze, type Maze } from "./maze";

/** Number of steps played by the "add steps" button. */
const STEPS = 10;

interface Game {
  maze: Maze;
  astar: AStar;
  /** State before the last step, to animate the new paths. */
  previous: AStar | null;
}

export function useGame() {
  const [{ maze, astar, previous }, setGame] = React.useState<Game>(createGame);
  const [animating, setAnimating] = React.useState(false);
  const handleRestart = () => {
    setAnimating(false);
    setGame(createGame());
  };
  const play = (count: number) => {
    setAnimating(true);
    setGame((game) => ({ ...game, astar: playSteps(game, count), previous: game.astar }));
  };
  const handleNextStep = () => play(1);
  const handleAddSteps = () => play(STEPS);
  const handleAnimationEnd = () => setAnimating(false);
  const found =
    astar.done && astar.parents.has(maze.target)
      ? { cells: getPath(astar, maze.target).length - 1, cost: getPathCost(astar, maze.target) }
      : null;
  return {
    maze,
    astar,
    previous,
    animating,
    found,
    handleRestart,
    steps: STEPS,
    handleNextStep,
    handleAddSteps,
    handleAnimationEnd,
  };
}

function createGame(): Game {
  const maze = createMaze();
  return { maze, astar: createAStar(maze), previous: null };
}

function playSteps({ maze, astar }: Game, count: number): AStar {
  let state = astar;
  for (let i = 0; i < count && !state.done; i++) state = stepAStar(maze, state);
  return state;
}
