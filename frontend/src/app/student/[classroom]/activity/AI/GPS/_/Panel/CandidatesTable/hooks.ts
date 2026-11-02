import React from "react";

import { type AStar, getCandidates, getClosestCandidate } from "../../astar";
import type { Maze } from "../../maze";
import type { RouteKind } from "./RouteIcon";

export const COLUMNS = ["length", "manhattan", "euclidean", "score"] as const;
export type Column = (typeof COLUMNS)[number];
export type Highlight = "lowest" | "highest" | undefined;

export function useCandidateRows(maze: Maze, astar: AStar) {
  return React.useMemo(() => {
    const closest = getClosestCandidate(maze, astar);
    const rows = getCandidates(maze, astar)
      .map((candidate, index) => {
        const kind: RouteKind =
          index === 0 ? "best" : candidate.cell === closest ? "closest" : "path";
        // Rounded as displayed, so that equal values are highlighted the same way.
        return { ...candidate, euclidean: Math.round(candidate.euclidean * 10) / 10, kind };
      })
      // The start alone (before the first step) is not a path yet.
      .filter((row) => row.length > 0);
    const ranges = Object.fromEntries(
      COLUMNS.map((column) => {
        const values = rows.map((row) => row[column]);
        return [column, { min: Math.min(...values), max: Math.max(...values) }];
      }),
    ) as Record<Column, { min: number; max: number }>;
    /** Nothing is highlighted when all the values of the column are equal. */
    const getHighlight = (column: Column, value: number): Highlight => {
      const { min, max } = ranges[column];
      if (min === max) return undefined;
      if (value === min) return "lowest";
      if (value === max) return "highest";
      return undefined;
    };
    return { rows, getHighlight };
  }, [maze, astar]);
}
