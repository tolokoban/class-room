import { type CellPos, type Cells, cellKey, isInsideGrid, type Rect } from "./address";
import { formatValue, toCanonical, toLocal } from "./content";
import { type CellValue } from "./evaluate";
import { shiftFormula } from "./fill";
import { type Locale } from "./locale";

/** Rectangle of copied cells. */
export interface ClipboardData {
  /** Tab separated values, as written in the system clipboard. */
  text: string;
  /** Raw content (canonical form) of the copied cells, row by row. */
  raws: string[][];
  /** Position of the top left copied cell, used to shift the relative references of formulas. */
  origin: CellPos;
}

/**
 * Copy a rectangle of cells.
 * @param valuesOnly - Copy the computed values instead of the formulas.
 */
export function copyCells(
  cells: Cells,
  values: Record<string, CellValue>,
  rect: Rect,
  locale: Locale,
  valuesOnly: boolean,
): ClipboardData {
  const raws: string[][] = [];
  const lines: string[] = [];
  for (let row = rect.top; row <= rect.bottom; row++) {
    const rawLine: string[] = [];
    const textLine: string[] = [];
    for (let col = rect.left; col <= rect.right; col++) {
      const key = cellKey({ col, row });
      const text = valuesOnly
        ? formatValue(values[key] ?? null, locale)
        : toLocal(cells[key] ?? "", locale);
      textLine.push(text);
      rawLine.push(valuesOnly ? toCanonical(text, locale) : (cells[key] ?? ""));
    }
    raws.push(rawLine);
    lines.push(textLine.join("\t"));
  }
  return { text: lines.join("\n"), raws, origin: { col: rect.left, row: rect.top } };
}

/** Parse tab separated values coming from another application. */
export function parseClipboardText(text: string, locale: Locale): ClipboardData {
  const lines = text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  const raws = lines.map((line) => line.split("\t").map((cell) => toCanonical(cell, locale)));
  return { text, raws, origin: { col: 0, row: 0 } };
}

/**
 * Paste `data` with its top left corner on `target`.
 * Relative references of formulas are shifted, cells falling outside the grid are ignored.
 * @returns The new cells and the rectangle of the pasted cells (clamped to the grid).
 */
export function pasteCells(
  cells: Cells,
  data: ClipboardData,
  target: CellPos,
): { cells: Cells; rect: Rect } {
  const result = { ...cells };
  const dRow = target.row - data.origin.row;
  const dCol = target.col - data.origin.col;
  const rect: Rect = { top: target.row, left: target.col, bottom: target.row, right: target.col };
  data.raws.forEach((line, y) => {
    line.forEach((raw, x) => {
      const pos = { col: target.col + x, row: target.row + y };
      if (!isInsideGrid(pos)) return;

      rect.bottom = Math.max(rect.bottom, pos.row);
      rect.right = Math.max(rect.right, pos.col);
      const key = cellKey(pos);
      const value = raw.startsWith("=") ? shiftFormula(raw, dRow, dCol) : raw;
      if (value === "") delete result[key];
      else result[key] = value;
    });
  });
  return { cells: result, rect };
}
