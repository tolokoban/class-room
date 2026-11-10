/** Number of columns of the sheet (A to E). */
export const COLUMNS = 5;
/** Number of rows of the sheet. */
export const ROWS = 30;

/**
 * Raw content of the non-empty cells, indexed by their key ("A1", "B7", ...).
 * Formulas are stored in their canonical (english) form.
 */
export type Cells = Record<string, string>;

/** Zero-based position of a cell. */
export interface CellPos {
  col: number;
  row: number;
}

/** Rectangle of cells, bounds included. */
export interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

/** 0 -> "A", 25 -> "Z", 26 -> "AA", ... */
export function columnName(col: number): string {
  let name = "";
  let index = col + 1;
  while (index > 0) {
    const rest = (index - 1) % 26;
    name = String.fromCharCode(65 + rest) + name;
    index = Math.floor((index - 1) / 26);
  }
  return name;
}

/** "A" -> 0, "Z" -> 25, "AA" -> 26, ... (case insensitive) */
export function columnIndex(name: string): number {
  let index = 0;
  for (const char of name.toUpperCase()) {
    index = index * 26 + (char.charCodeAt(0) - 64);
  }
  return index - 1;
}

export function cellKey({ col, row }: CellPos): string {
  return `${columnName(col)}${row + 1}`;
}

export function isInsideGrid({ col, row }: CellPos): boolean {
  return col >= 0 && col < COLUMNS && row >= 0 && row < ROWS;
}

export function clampToGrid({ col, row }: CellPos): CellPos {
  return {
    col: Math.max(0, Math.min(COLUMNS - 1, col)),
    row: Math.max(0, Math.min(ROWS - 1, row)),
  };
}

export function rectOf(a: CellPos, b: CellPos): Rect {
  return {
    top: Math.min(a.row, b.row),
    left: Math.min(a.col, b.col),
    bottom: Math.max(a.row, b.row),
    right: Math.max(a.col, b.col),
  };
}

export function rectContains(rect: Rect, { col, row }: CellPos): boolean {
  return row >= rect.top && row <= rect.bottom && col >= rect.left && col <= rect.right;
}

export function rectCells(rect: Rect): CellPos[] {
  const cells: CellPos[] = [];
  for (let row = rect.top; row <= rect.bottom; row++) {
    for (let col = rect.left; col <= rect.right; col++) cells.push({ col, row });
  }
  return cells;
}

export function sameRect(a: Rect | null, b: Rect | null): boolean {
  if (!a || !b) return a === b;
  return a.top === b.top && a.left === b.left && a.bottom === b.bottom && a.right === b.right;
}
