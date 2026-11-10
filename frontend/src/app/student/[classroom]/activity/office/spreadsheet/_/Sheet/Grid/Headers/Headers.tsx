import { Theme } from "@tolokoban/ui";

import { columnName, COLUMNS, type Rect, ROWS } from "../../engine/address";

import Styles from "./Headers.module.css";

const $ = Theme.classNames;

export interface HeadersProps {
  className?: string;
  /** Rows and columns of the selection are highlighted. */
  selection: Rect;
}

const COLUMN_INDEXES = Array.from({ length: COLUMNS }, (_, col) => col);
const ROW_INDEXES = Array.from({ length: ROWS }, (_, row) => row);

/** Sticky headers: column names at the top and row numbers on the left. */
export function Headers({ className, selection }: HeadersProps) {
  return (
    <>
      <div className={$.join(className, Styles.corner)} />
      {COLUMN_INDEXES.map((col) => (
        <div
          key={`col${col}`}
          className={$.join(className, Styles.headers, Styles.column)}
          style={{ gridRow: 1, gridColumn: col + 2 }}
          data-header-col={col}
          data-highlighted={col >= selection.left && col <= selection.right}
        >
          {columnName(col)}
        </div>
      ))}
      {ROW_INDEXES.map((row) => (
        <div
          key={`row${row}`}
          className={$.join(className, Styles.headers, Styles.row)}
          style={{ gridRow: row + 2, gridColumn: 1 }}
          data-header-row={row}
          data-highlighted={row >= selection.top && row <= selection.bottom}
        >
          {row + 1}
        </div>
      ))}
    </>
  );
}
