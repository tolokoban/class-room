import { type AStar, getCandidateSegments } from "../astar";
import type { Frame } from "./paint";

export interface Segment {
  from: number;
  to: number;
  /** Visible part of the segment, between 0 and 1. */
  fraction: number;
}

/**
 * Candidate segments, from parent to cell. The segments added since `previous` grow
 * with the number of cells of their path: they all grow at the same speed and end together.
 */
export function getSegments({ astar, previous, progress }: Frame): Segment[] {
  const segments = getCandidateSegments(astar);
  if (!previous || progress >= 1) {
    return segments.map(([to, from]) => ({ from, to, fraction: 1 }));
  }

  const isNew = ([cell, parent]: [number, number]) => previous.parents.get(cell) !== parent;
  const getHops = createHopsCounter(astar);
  const hops = segments.filter(isNew).map(([cell]) => getHops(cell));
  // Number of cells of the shortest path that starts growing.
  const base = Math.min(...hops) - 1;
  const depth = Math.max(...hops) - base;
  return segments.map((segment) => {
    const [to, from] = segment;
    if (!isNew(segment)) return { from, to, fraction: 1 };

    const fraction = progress * depth - (getHops(to) - 1 - base);
    return { from, to, fraction: Math.min(1, fraction) };
  });
}

/**
 * Number of cells between the start and a cell, remembered to walk each path only once.
 */
function createHopsCounter({ parents }: AStar): (cell: number) => number {
  const hops = new Map<number, number>();
  const getHops = (cell: number): number => {
    const known = hops.get(cell);
    if (known !== undefined) return known;

    const parent = parents.get(cell);
    const count = parent === undefined ? 0 : getHops(parent) + 1;
    hops.set(cell, count);
    return count;
  };
  return getHops;
}
