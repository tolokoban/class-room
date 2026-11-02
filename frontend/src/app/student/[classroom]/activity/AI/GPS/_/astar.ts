/**
 * A* search, one step at a time, to show how the shortest path is found.
 */

import { getEmptyNeighbours, type Maze } from "./maze";

/**
 * Costs are counted in tenths of a road cell, to keep them integer:
 * crossing a road cell costs 10, and crossing a highway cell costs 1.
 */
const ROAD_COST = 10;
const HIGHWAY_COST = 1;

export interface AStar {
  /** Cost (in tenths of a road cell) of the best known path from the start to each discovered cell. */
  costs: Map<number, number>;
  /** Previous cell on the best known path to each discovered cell. */
  parents: Map<number, number>;
  /** Cells at the tip of a candidate path, still to be explored. */
  open: Set<number>;
  /** Cells already explored. */
  closed: Set<number>;
  /** Number of steps computed so far. */
  steps: number;
  /** Number of candidate paths created so far. */
  routes: number;
  /** True when the target has been reached (or when there is nothing left to explore). */
  done: boolean;
}

export function createAStar({ start }: Maze): AStar {
  return {
    costs: new Map([[start, 0]]),
    parents: new Map(),
    open: new Set([start]),
    closed: new Set(),
    steps: 0,
    routes: 1,
    done: false,
  };
}

/**
 * Explore the best candidate: from each of its neighbours, follow the corridor (if any)
 * up to the next crossroad, dead-end or the target, which becomes a new candidate.
 * @returns A new state: the argument is not modified.
 */
export function stepAStar(maze: Maze, state: AStar): AStar {
  const best = getBestCandidate(maze, state);
  if (state.done || best === undefined) return { ...state, done: true };
  if (best === maze.target) return { ...state, steps: state.steps + 1, done: true };

  const costs = new Map(state.costs);
  const parents = new Map(state.parents);
  const open = new Set(state.open);
  const closed = new Set(state.closed);
  open.delete(best);
  closed.add(best);
  const next = { ...state, costs, parents, open, closed };
  for (const neighbour of getNeighbours(maze, best)) {
    followCorridor(maze, next, best, neighbour);
  }
  return { ...next, steps: state.steps + 1, done: open.size === 0 };
}

/**
 * Extend the path from `previous` to `cell`, and go on as long as there is only one way forward
 * (a cell with exactly two empty neighbours). The tip of the path becomes a new candidate.
 * Nothing is added if the path reaches a cell that already has a cheaper (or equal) path.
 * The `state` is modified.
 */
function followCorridor(maze: Maze, state: AStar, previous: number, cell: number) {
  const { costs, parents, open, closed } = state;
  let cost = (costs.get(previous) ?? 0) + getCellCost(maze, cell);
  for (;;) {
    if (closed.has(cell) || cost >= (costs.get(cell) ?? Infinity)) return;

    costs.set(cell, cost);
    parents.set(cell, previous);
    const neighbours = getNeighbours(maze, cell);
    if (cell === maze.target || neighbours.length !== 2) {
      open.add(cell);
      state.routes++;
      return;
    }
    [previous, cell] = [cell, neighbours[0] === previous ? neighbours[1] : neighbours[0]];
    cost += getCellCost(maze, cell);
  }
}

export interface Candidate {
  /** Tip of the candidate path. */
  cell: number;
  /** Cost of the path: 1 per road cell, 1/10 per highway cell (the start is not counted). */
  length: number;
  /** Manhattan distance to the target: the heuristic. */
  manhattan: number;
  /** Euclidean distance to the target. */
  euclidean: number;
  /** Length + heuristic: A* explores the candidate with the smallest score first. */
  score: number;
}

/**
 * All the candidates, the best first: smallest length + heuristic, then closest to the target.
 */
export function getCandidates(maze: Maze, { costs, open }: AStar): Candidate[] {
  return Array.from(open, (cell) => {
    const length = (costs.get(cell) ?? 0) / ROAD_COST;
    const manhattan = distance(maze, cell, maze.target);
    const euclidean = Math.sqrt(squaredEuclideanDistance(maze, cell, maze.target));
    return { cell, length, manhattan, euclidean, score: length + manhattan };
  }).sort((a, b) => a.score - b.score || a.manhattan - b.manhattan);
}

/**
 * The candidate with the smallest length + heuristic.
 * In case of a tie, the one closest to the target.
 */
export function getBestCandidate(maze: Maze, state: AStar): number | undefined {
  return getCandidates(maze, state)[0]?.cell;
}

/**
 * The candidate closest to the target, as the crow flies (Euclidean distance).
 * In case of a tie, the one with the shortest path.
 */
export function getClosestCandidate(maze: Maze, { costs, open }: AStar): number | undefined {
  let closest: number | undefined;
  let closestDistance = Infinity;
  let closestCost = Infinity;
  for (const cell of open) {
    const distance = squaredEuclideanDistance(maze, cell, maze.target);
    const cost = costs.get(cell) ?? 0;
    if (distance < closestDistance || (distance === closestDistance && cost < closestCost)) {
      closest = cell;
      closestDistance = distance;
      closestCost = cost;
    }
  }
  return closest;
}

/**
 * Cost of the best known path to `cell`: 1 per road cell, 1/10 per highway cell.
 */
export function getPathCost({ costs }: AStar, cell: number): number {
  return (costs.get(cell) ?? 0) / ROAD_COST;
}

/**
 * Cells from the start to `cell` (both included).
 */
export function getPath({ parents }: AStar, cell: number): number[] {
  const path = [cell];
  for (let parent = parents.get(cell); parent !== undefined; parent = parents.get(parent)) {
    path.unshift(parent);
  }
  return path;
}

/**
 * Segments `[cell, parent]` of all the candidate paths, each segment appearing only once.
 */
export function getCandidateSegments({ parents, open }: AStar): Array<[number, number]> {
  const segments: Array<[number, number]> = [];
  const visited = new Set<number>();
  for (const tip of open) {
    let cell = tip;
    let parent = parents.get(cell);
    while (parent !== undefined && !visited.has(cell)) {
      visited.add(cell);
      segments.push([cell, parent]);
      cell = parent;
      parent = parents.get(cell);
    }
  }
  return segments;
}

/**
 * Manhattan distance: the heuristic of A*.
 */
export function distance({ width }: Maze, a: number, b: number): number {
  return (
    Math.abs((a % width) - (b % width)) + Math.abs(Math.floor(a / width) - Math.floor(b / width))
  );
}

/**
 * Square of the Euclidean distance: enough to compare distances, without a square root.
 */
function squaredEuclideanDistance({ width }: Maze, a: number, b: number): number {
  const dx = (a % width) - (b % width);
  const dy = Math.floor(a / width) - Math.floor(b / width);
  return dx * dx + dy * dy;
}

function getCellCost({ highways }: Maze, cell: number): number {
  return highways[cell] ? HIGHWAY_COST : ROAD_COST;
}

function getNeighbours({ width, height, walls }: Maze, cell: number): number[] {
  return getEmptyNeighbours(walls, width, height, cell);
}
