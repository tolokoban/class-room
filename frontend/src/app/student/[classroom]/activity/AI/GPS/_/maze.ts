/**
 * Random maze on a grid where each cell is either empty or a wall.
 *
 * Rooms are the cells with even coordinates. A random spanning tree (randomized Kruskal)
 * links them all, so any empty cell can be reached from any other one.
 * A highway follows the shortest path from the bottom-left corner to the top-right one.
 */

export const WIDTH = 64;
export const HEIGHT = 48;
/** Probability to remove a wall that is not needed, which creates alternative routes. */
export const LOOP_PROBABILITY = 0.1;
/** Probability to open a cell of the last column or row (which have no rooms). */
export const STUB_PROBABILITY = 0.5;
/** Minimal Manhattan distance between the start and the target. */
export const MIN_DISTANCE = 32;

export interface Maze {
  width: number;
  height: number;
  /** `walls[x + y * width]` is true for a wall. */
  walls: boolean[];
  /** `highways[x + y * width]` is true for a highway (always an empty cell). */
  highways: boolean[];
  /** Index of the starting cell. */
  start: number;
  /** Index of the target cell. */
  target: number;
}

interface Passage {
  /** Index of the wall cell between the two rooms. */
  cell: number;
  roomA: number;
  roomB: number;
}

export function createMaze(width = WIDTH, height = HEIGHT): Maze {
  const walls = Array.from({ length: width * height }, () => true);
  const cols = Math.ceil(width / 2);
  const rows = Math.ceil(height / 2);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      walls[2 * col + 2 * row * width] = false;
    }
  }
  const parents = Array.from({ length: cols * rows }, (_, i) => i);
  const find = (room: number): number => {
    while (parents[room] !== room) {
      parents[room] = parents[parents[room]];
      room = parents[room];
    }
    return room;
  };
  for (const { cell, roomA, roomB } of shuffle(listPassages(width, cols, rows))) {
    const rootA = find(roomA);
    const rootB = find(roomB);
    if (rootA !== rootB) {
      parents[rootA] = rootB;
      walls[cell] = false;
    } else if (Math.random() < LOOP_PROBABILITY) {
      walls[cell] = false;
    }
  }
  openStubs(walls, width, height);
  const highways = createHighways(walls, width, height);
  return { width, height, walls, highways, ...pickEndpoints(walls, width) };
}

/**
 * The cells of the shortest path between the empty cells closest
 * to the bottom-left and to the top-right corners.
 */
function createHighways(walls: boolean[], width: number, height: number): boolean[] {
  const highways = walls.map(() => false);
  const from = getClosestEmptyCell(walls, width, 0, height - 1);
  const to = getClosestEmptyCell(walls, width, width - 1, 0);
  // Breadth-first search.
  const parents = new Map<number, number>([[from, from]]);
  const queue = [from];
  for (let index = 0; index < queue.length && !parents.has(to); index++) {
    const cell = queue[index];
    for (const next of getEmptyNeighbours(walls, width, height, cell)) {
      if (parents.has(next)) continue;
      parents.set(next, cell);
      queue.push(next);
    }
  }
  for (let cell = to; cell !== from; cell = parents.get(cell) ?? from) highways[cell] = true;
  highways[from] = true;
  return highways;
}

function getClosestEmptyCell(walls: boolean[], width: number, x: number, y: number): number {
  let closest = 0;
  let closestDistance = Infinity;
  walls.forEach((wall, cell) => {
    const distance = Math.abs((cell % width) - x) + Math.abs(Math.floor(cell / width) - y);
    if (!wall && distance < closestDistance) {
      closest = cell;
      closestDistance = distance;
    }
  });
  return closest;
}

export function getEmptyNeighbours(
  walls: boolean[],
  width: number,
  height: number,
  cell: number,
): number[] {
  const x = cell % width;
  const y = Math.floor(cell / width);
  const neighbours: number[] = [];
  if (x > 0) neighbours.push(cell - 1);
  if (x < width - 1) neighbours.push(cell + 1);
  if (y > 0) neighbours.push(cell - width);
  if (y < height - 1) neighbours.push(cell + width);
  return neighbours.filter((next) => !walls[next]);
}

/**
 * Two random empty cells, at least `MIN_DISTANCE` apart (Manhattan distance).
 */
function pickEndpoints(walls: boolean[], width: number): { start: number; target: number } {
  const empty = walls.flatMap((wall, cell) => (wall ? [] : [cell]));
  const distance = (a: number, b: number) =>
    Math.abs((a % width) - (b % width)) + Math.abs(Math.floor(a / width) - Math.floor(b / width));
  for (;;) {
    const start = pickRandom(empty);
    const candidates = empty.filter((cell) => distance(start, cell) >= MIN_DISTANCE);
    if (candidates.length > 0) return { start, target: pickRandom(candidates) };
  }
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function listPassages(width: number, cols: number, rows: number): Passage[] {
  const passages: Passage[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const room = col + row * cols;
      const x = 2 * col;
      const y = 2 * row;
      if (col + 1 < cols) {
        passages.push({ cell: x + 1 + y * width, roomA: room, roomB: room + 1 });
      }
      if (row + 1 < rows) {
        passages.push({ cell: x + (y + 1) * width, roomA: room, roomB: room + cols });
      }
    }
  }
  return passages;
}

/**
 * With an even size, the last column (or row) has no room.
 * We open some of its cells next to a room: they become small dead-ends.
 */
function openStubs(walls: boolean[], width: number, height: number) {
  if (width % 2 === 0) {
    for (let y = 0; y < height - 1; y += 2) {
      if (Math.random() < STUB_PROBABILITY) walls[width - 1 + y * width] = false;
    }
  }
  if (height % 2 === 0) {
    for (let x = 0; x < width - 1; x += 2) {
      if (Math.random() < STUB_PROBABILITY) walls[x + (height - 1) * width] = false;
    }
  }
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
