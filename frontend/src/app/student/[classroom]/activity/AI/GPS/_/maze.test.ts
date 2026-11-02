import { describe, expect, it } from "vitest";

import { createMaze, getEmptyNeighbours, HEIGHT, type Maze, MIN_DISTANCE, WIDTH } from "./maze";

describe("createMaze", () => {
  it("has the expected size", () => {
    const maze = createMaze();
    expect(maze.width).toBe(WIDTH);
    expect(maze.height).toBe(HEIGHT);
    expect(maze.walls.length).toBe(WIDTH * HEIGHT);
  });

  it("puts the start and the target on empty cells, far enough from each other", () => {
    for (let i = 0; i < 20; i++) {
      const { width, walls, start, target } = createMaze();
      expect(walls[start]).toBe(false);
      expect(walls[target]).toBe(false);
      const distance =
        Math.abs((start % width) - (target % width)) +
        Math.abs(Math.floor(start / width) - Math.floor(target / width));
      expect(distance).toBeGreaterThanOrEqual(MIN_DISTANCE);
    }
  });

  it("puts the highway on empty cells, from one corner to the other", () => {
    for (let i = 0; i < 20; i++) {
      const { width, height, walls, highways } = createMaze();
      const cells = highways.flatMap((highway, cell) => (highway ? [cell] : []));
      expect(cells.every((cell) => !walls[cell])).toBe(true);
      // Each highway cell is linked to one or two other highway cells.
      for (const cell of cells) {
        const links = getEmptyNeighbours(walls, width, height, cell).filter(
          (next) => highways[next],
        );
        expect(links.length).toBeGreaterThanOrEqual(1);
      }
      expect(cells.some((cell) => cell % width < 2 && Math.floor(cell / width) > height - 3)).toBe(
        true,
      );
      expect(cells.some((cell) => cell % width > width - 3 && Math.floor(cell / width) < 2)).toBe(
        true,
      );
    }
  });

  it("can reach every empty cell from any empty cell", () => {
    for (let i = 0; i < 20; i++) {
      const maze = createMaze();
      const empty = maze.walls.filter((wall) => !wall).length;
      expect(countReachable(maze)).toBe(empty);
    }
  });
});

function countReachable({ width, height, walls }: Maze): number {
  const start = walls.indexOf(false);
  const visited = new Set<number>([start]);
  const stack = [start];
  while (stack.length > 0) {
    const cell = stack.pop() ?? 0;
    const x = cell % width;
    const y = Math.floor(cell / width);
    const neighbours = [
      x > 0 ? cell - 1 : -1,
      x < width - 1 ? cell + 1 : -1,
      y > 0 ? cell - width : -1,
      y < height - 1 ? cell + width : -1,
    ];
    for (const next of neighbours) {
      if (next < 0 || walls[next] || visited.has(next)) continue;
      visited.add(next);
      stack.push(next);
    }
  }
  return visited.size;
}
