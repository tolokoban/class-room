import { describe, expect, it } from "vitest";

import { createAStar, getBestCandidate, getPath, getPathCost, stepAStar } from "./astar";
import { createMaze, getEmptyNeighbours, type Maze } from "./maze";

describe("A*", () => {
  it("finds a valid path to the target, whose cost matches its cells", () => {
    for (let i = 0; i < 20; i++) {
      const maze = createMaze();
      let state = createAStar(maze);
      while (!state.done) state = stepAStar(maze, state);
      expect(getBestCandidate(maze, state)).toBe(maze.target);
      const path = getPath(state, maze.target);
      expect(path[0]).toBe(maze.start);
      for (let k = 1; k < path.length; k++) {
        expect(getEmptyNeighbours(maze.walls, maze.width, maze.height, path[k - 1])).toContain(
          path[k],
        );
      }
      const cost = path.slice(1).reduce((sum, cell) => sum + (maze.highways[cell] ? 1 : 10), 0);
      expect(getPathCost(state, maze.target)).toBe(cost / 10);
      expect(cost).toBeGreaterThanOrEqual(cheapestCost(maze));
    }
  });
});

/**
 * Dijkstra's algorithm, as a reference (costs in tenths of a road cell).
 */
function cheapestCost({ width, height, walls, highways, start, target }: Maze): number {
  const costs = new Map([[start, 0]]);
  const done = new Set<number>();
  for (;;) {
    let cell = -1;
    for (const [candidate, cost] of costs) {
      if (!done.has(candidate) && (cell < 0 || cost < (costs.get(cell) ?? Infinity))) {
        cell = candidate;
      }
    }
    if (cell === target || cell < 0) return costs.get(target) ?? -1;

    done.add(cell);
    for (const next of getEmptyNeighbours(walls, width, height, cell)) {
      const cost = (costs.get(cell) ?? 0) + (highways[next] ? 1 : 10);
      if (cost < (costs.get(next) ?? Infinity)) costs.set(next, cost);
    }
  }
}
