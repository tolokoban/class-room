import { type Cells } from "./Sheet/engine/address";
import { type CellValue, evaluateSheet, FormulaError } from "./Sheet/engine/evaluate";
import { CANONICAL, parseNumber } from "./Sheet/engine/locale";
import { type Ref, stringify, tokenize } from "./Sheet/engine/tokenizer";

/** Number of times the numbers of the sheets are replaced by random values. */
const RANDOM_PASSES = 5;

/**
 * Find the wrong formulas of the student's sheet.
 *
 * Let `F` be the cells of the expected sheet with a formula,
 * and `N` the cells with a number and no formula.
 * 1. Every cell of `F` must give the same value in both sheets.
 * 2. The cells of `N` get the same random numbers in both sheets, and we go back to 1.
 *
 * This way, a formula that differs from the solution is accepted if it is equivalent
 * (`=2*A1` instead of `=A1*2`), but not if it only gives the right value by chance
 * (typing `14` or `=14` instead of `=A1*2`).
 * A formula without any cell reference is wrong if the expected one has references.
 * @returns The keys of the cells of `F` that are wrong, sorted.
 */
export function findWrongFormulas(
  cells: Cells,
  expected: Cells,
  random: () => number = Math.random,
): string[] {
  const formulas = Object.keys(expected).filter((key) => isFormula(expected[key]));
  const numbers = Object.keys(expected).filter(
    (key) => !isFormula(expected[key]) && parseNumber(expected[key], CANONICAL) !== undefined,
  );
  const wrong = new Set(
    formulas.filter(
      (key) =>
        !isFormula(cells[key]) ||
        // `=8` gives the right value, but only by chance.
        (usesReference(expected[key]) && !usesReference(cells[key])),
    ),
  );
  let studentCells = cells;
  let expectedCells = expected;
  for (let pass = 0; pass <= RANDOM_PASSES; pass++) {
    if (pass > 0) {
      const randomized = randomNumbers(numbers, expected, random);
      studentCells = { ...cells, ...randomized };
      expectedCells = { ...expected, ...randomized };
    }
    const values = evaluateSheet(studentCells);
    const expectedValues = evaluateSheet(expectedCells);
    for (const key of formulas) {
      if (!sameValue(values[key] ?? null, expectedValues[key] ?? null)) wrong.add(key);
    }
  }
  return [...wrong].sort();
}

/**
 * Find the formulas of the student's sheet that are longer than the expected ones.
 * Spaces are ignored, so that `= A1 * 2` is not considered longer than `=A1*2`.
 * @returns The keys of the cells with a too long formula, sorted.
 */
export function findLongFormulas(cells: Cells, expected: Cells): string[] {
  return Object.keys(expected)
    .filter((key) => {
      const solution = expected[key];
      const formula = cells[key];
      if (!isFormula(solution) || !isFormula(formula)) return false;
      return formulaLength(formula) > formulaLength(solution);
    })
    .sort();
}

/** Length of a formula once converted to its canonical form, without spaces. */
function formulaLength(formula: string): number {
  const tokens = tokenize(formula.slice(1), CANONICAL).filter((token) => token.type !== "space");
  return stringify(tokens, CANONICAL, CANONICAL).length;
}

/**
 * Find the cells that should use a `$` in their references, but don't.
 * @param keys - Cells whose formula must contain at least one absolute reference.
 * @returns The keys of the cells without any `$` in their references, sorted.
 */
export function findMissingDollars(cells: Cells, keys: string[] = []): string[] {
  return keys.filter((key) => !usesDollar(cells[key])).sort();
}

function usesDollar(raw: string | undefined): boolean {
  return refsOf(raw).some((ref) => ref.colAbs || ref.rowAbs);
}

function usesReference(raw: string | undefined): boolean {
  return refsOf(raw).length > 0;
}

/** Cell references of a formula (empty for a value). */
function refsOf(raw: string | undefined): Ref[] {
  if (raw === undefined || !isFormula(raw)) return [];
  return tokenize(raw.slice(1), CANONICAL).flatMap((token) =>
    token.type === "ref" ? [token.ref] : [],
  );
}

export function sheetMatches(cells: Cells, expected: Cells): boolean {
  return findWrongFormulas(cells, expected).length === 0;
}

/**
 * Random integers of the same magnitude as the original numbers,
 * to keep conditions like `=IF(A1>10, ...)` meaningful.
 */
function randomNumbers(keys: string[], expected: Cells, random: () => number): Cells {
  const result: Cells = {};
  for (const key of keys) {
    const original = parseNumber(expected[key], CANONICAL) ?? 0;
    const max = Math.max(10, Math.ceil(2 * Math.abs(original)));
    const value = Math.floor(random() * (max + 1));
    result[key] = `${original < 0 ? -value : value}`;
  }
  return result;
}

function isFormula(raw: string | undefined): boolean {
  return raw?.startsWith("=") ?? false;
}

function sameValue(a: CellValue, b: CellValue): boolean {
  if (a instanceof FormulaError || b instanceof FormulaError) {
    return a instanceof FormulaError && b instanceof FormulaError && a.code === b.code;
  }
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  }
  return a === b;
}
