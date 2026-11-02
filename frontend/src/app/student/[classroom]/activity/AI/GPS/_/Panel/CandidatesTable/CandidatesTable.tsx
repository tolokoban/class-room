import { Theme } from "@tolokoban/ui";

import type { AStar } from "../../astar";
import type { Maze } from "../../maze";
import { COLUMNS, useCandidateRows } from "./hooks";
import { NumberCell } from "./NumberCell";
import { RouteIcon } from "./RouteIcon";
import { useTranslation } from "./translation";

import Styles from "./CandidatesTable.module.css";

const $ = Theme.classNames;

export interface CandidatesTableProps {
  className?: string;
  maze: Maze;
  astar: AStar;
}

/**
 * The candidate paths, the best one first.
 */
export function CandidatesTable({ className, maze, astar }: CandidatesTableProps) {
  const tr = useTranslation();
  const { rows, getHighlight } = useCandidateRows(maze, astar);
  return (
    <table className={$.join(className, Styles.candidatesTable)}>
      <thead>
        <tr>
          <th>{tr.route}</th>
          {COLUMNS.map((column) => (
            <th key={column}>{tr[column]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.cell}>
            <td>
              <RouteIcon kind={row.kind} />
            </td>
            {COLUMNS.map((column) => (
              <NumberCell
                key={column}
                value={row[column]}
                decimals={column === "euclidean" ? 1 : 0}
                highlight={getHighlight(column, row[column])}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
