import { type Cells, cellKey, isInsideGrid, rectCells, rectOf } from "./address";
import { CANONICAL, type ErrorCode, findFunction, type FunctionName, parseNumber } from "./locale";
import { type Node, parse } from "./parser";
import { type Ref, tokenize } from "./tokenizer";

export class FormulaError {
  constructor(readonly code: ErrorCode) {}
}

/** Computed value of a cell. `null` means empty. */
export type CellValue = null | number | string | FormulaError;

/** Values of a range (or of a single reference used as a function argument). */
class RangeValue {
  constructor(readonly values: CellValue[]) {}
}

type Result = CellValue | RangeValue;

/**
 * Compute the value of every non-empty cell.
 * @returns The values indexed by cell key. Missing keys are empty cells.
 */
export function evaluateSheet(cells: Cells): Record<string, CellValue> {
  const values: Record<string, CellValue> = {};
  const visiting = new Set<string>();
  const valueOf = (key: string): CellValue => {
    if (key in values) return values[key];
    if (visiting.has(key)) return new FormulaError("CIRC");

    visiting.add(key);
    const value = evaluateRaw(cells[key] ?? "", valueOf);
    visiting.delete(key);
    values[key] = value;
    return value;
  };
  for (const key of Object.keys(cells)) valueOf(key);
  return values;
}

/** Value of a cell given its raw (canonical) content. */
function evaluateRaw(raw: string, valueOf: (key: string) => CellValue): CellValue {
  if (raw.trim() === "") return null;
  if (!raw.startsWith("=")) return parseNumber(raw, CANONICAL) ?? raw;

  let node: Node;
  try {
    node = parse(tokenize(raw.slice(1), CANONICAL));
  } catch {
    return new FormulaError("SYNTAX");
  }
  const result = toScalar(evaluateNode(node, valueOf));
  // A formula pointing to an empty cell displays 0.
  return result ?? 0;
}

function evaluateNode(node: Node, valueOf: (key: string) => CellValue): Result {
  switch (node.type) {
    case "number":
      return node.value;
    case "error":
      return new FormulaError(node.code);
    case "name":
      return new FormulaError("NAME");
    case "ref":
      return refValue(node.ref, valueOf);
    case "range":
      return rangeValue(node.from, node.to, valueOf);
    case "unary": {
      const arg = toNumber(evaluateNode(node.arg, valueOf));
      if (arg instanceof FormulaError) return arg;
      return node.op === "-" ? -arg : arg;
    }
    case "binary":
      return binary(node.op, evaluateNode(node.left, valueOf), evaluateNode(node.right, valueOf));
    case "call":
      return call(node.name, node.args, valueOf);
  }
}

function refValue(ref: Ref, valueOf: (key: string) => CellValue): CellValue {
  if (!isInsideGrid(ref)) return new FormulaError("REF");
  return valueOf(cellKey(ref));
}

function rangeValue(from: Ref, to: Ref, valueOf: (key: string) => CellValue): Result {
  if (!isInsideGrid(from) || !isInsideGrid(to)) return new FormulaError("REF");

  return new RangeValue(rectCells(rectOf(from, to)).map((pos) => valueOf(cellKey(pos))));
}

function binary(op: "+" | "-" | "*" | "/", left: Result, right: Result): CellValue {
  const a = toNumber(left);
  if (a instanceof FormulaError) return a;
  const b = toNumber(right);
  if (b instanceof FormulaError) return b;

  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? new FormulaError("DIV0") : a / b;
  }
}

/** A range outside a function is an error. */
function toScalar(value: Result): CellValue {
  return value instanceof RangeValue ? new FormulaError("VALUE") : value;
}

/** Empty cells count as 0, text is an error. */
function toNumber(value: Result): number | FormulaError {
  const scalar = toScalar(value);
  if (scalar === null) return 0;
  if (typeof scalar === "string") return new FormulaError("VALUE");
  return scalar;
}

function call(name: string, args: Node[], valueOf: (key: string) => CellValue): CellValue {
  const fn = findFunction(name, CANONICAL);
  if (!fn) return new FormulaError("NAME");
  if (args.length === 0) return new FormulaError("VALUE");

  const values = args.map((arg) =>
    // Like ranges, a single reference ignores text when used as an argument.
    arg.type === "ref" ? new RangeValue([refValue(arg.ref, valueOf)]) : evaluateNode(arg, valueOf),
  );
  return FUNCTIONS[fn](values);
}

const FUNCTIONS: Record<FunctionName, (args: Result[]) => CellValue> = {
  SUM(args) {
    const stats = numericStats(args);
    return stats instanceof FormulaError ? stats : stats.sum;
  },
  AVERAGE(args) {
    const stats = numericStats(args);
    if (stats instanceof FormulaError) return stats;
    return stats.count === 0 ? new FormulaError("DIV0") : stats.sum / stats.count;
  },
  COUNT(args) {
    let count = 0;
    for (const arg of args) {
      if (arg instanceof RangeValue) {
        count += arg.values.filter((value) => typeof value === "number").length;
      } else if (typeof arg === "number") count++;
    }
    return count;
  },
  COUNTA(args) {
    let count = 0;
    for (const arg of args) {
      if (arg instanceof RangeValue) {
        count += arg.values.filter((value) => value !== null).length;
      } else if (arg !== null) count++;
    }
    return count;
  },
};

/**
 * Sum and count the numbers of the arguments.
 * In ranges, text and empty cells are ignored. Errors are propagated.
 */
function numericStats(args: Result[]): { sum: number; count: number } | FormulaError {
  let sum = 0;
  let count = 0;
  for (const arg of args) {
    const values = arg instanceof RangeValue ? arg.values : [toNumber(arg)];
    for (const value of values) {
      if (value instanceof FormulaError) return value;
      if (typeof value !== "number") continue;

      sum += value;
      count++;
    }
  }
  return { sum, count };
}
