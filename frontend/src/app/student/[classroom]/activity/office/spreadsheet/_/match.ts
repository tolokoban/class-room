import { type Cells, cellKey, COLUMNS, ROWS } from "./Sheet/engine/address";
import { type CellValue, evaluateSheet, FormulaError } from "./Sheet/engine/evaluate";

/**
 * The student's sheet matches the expected one if every cell has the same value,
 * and if the cells computed by a formula in the expected sheet are formulas too
 * (typing `14` instead of `=A1*2` is not accepted, but `=2*A1` is).
 */
export function sheetMatches(cells: Cells, expected: Cells): boolean {
  const values = evaluateSheet(cells);
  const expectedValues = evaluateSheet(expected);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const key = cellKey({ col, row });
      if (!sameValue(values[key] ?? null, expectedValues[key] ?? null)) return false;
      if (isFormula(expected[key]) && !isFormula(cells[key])) return false;
    }
  }
  return true;
}

function isFormula(raw: string | undefined): boolean {
  return raw?.startsWith("=") ?? false;
}

function sameValue(a: CellValue, b: CellValue): boolean {
  if (a instanceof FormulaError || b instanceof FormulaError) {
    return a instanceof FormulaError && b instanceof FormulaError && a.code === b.code;
  }
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  return a === b;
}
