import { type Cells, cellKey, isInsideGrid, rectCells, rectOf } from "./address";
import {
  CANONICAL,
  type ErrorCode,
  findFunction,
  formatNumber,
  type FunctionName,
  type Locale,
  parseNumber,
} from "./locale";
import {
  type ArithmeticOperator,
  type BinaryOperator,
  type ComparisonOperator,
  type Node,
  parse,
} from "./parser";
import { type Ref, tokenize } from "./tokenizer";

export class FormulaError {
  constructor(readonly code: ErrorCode) {}
}

/** Computed value of a cell. `null` means empty. */
export type CellValue = null | number | string | boolean | FormulaError;

/** Values of a range (or of a single reference used as a function argument). */
class RangeValue {
  constructor(readonly values: CellValue[]) {}
}

type Result = CellValue | RangeValue;

interface Context {
  valueOf(key: string): CellValue;
  /** Used to convert numbers and logical values into text (with the "&" operator). */
  locale: Locale;
}

/**
 * Compute the value of every non-empty cell.
 * @param locale Language used to convert numbers and logical values into text.
 * @returns The values indexed by cell key. Missing keys are empty cells.
 */
export function evaluateSheet(cells: Cells, locale: Locale = CANONICAL): Record<string, CellValue> {
  const values: Record<string, CellValue> = {};
  const visiting = new Set<string>();
  const ctx: Context = {
    locale,
    valueOf(key: string): CellValue {
      if (key in values) return values[key];
      if (visiting.has(key)) return new FormulaError("CIRC");

      visiting.add(key);
      const value = evaluateRaw(cells[key] ?? "", ctx);
      visiting.delete(key);
      values[key] = value;
      return value;
    },
  };
  for (const key of Object.keys(cells)) ctx.valueOf(key);
  return values;
}

/** Value of a cell given its raw (canonical) content. */
function evaluateRaw(raw: string, ctx: Context): CellValue {
  if (raw.trim() === "") return null;
  if (!raw.startsWith("=")) return parseNumber(raw, CANONICAL) ?? raw;

  let node: Node;
  try {
    node = parse(tokenize(raw.slice(1), CANONICAL));
  } catch {
    return new FormulaError("SYNTAX");
  }
  const result = toScalar(evaluateNode(node, ctx));
  // A formula pointing to an empty cell displays 0.
  return result ?? 0;
}

function evaluateNode(node: Node, ctx: Context): Result {
  switch (node.type) {
    case "number":
    case "string":
    case "boolean":
      return node.value;
    case "error":
      return new FormulaError(node.code);
    case "name":
      return new FormulaError("NAME");
    case "ref":
      return refValue(node.ref, ctx);
    case "range":
      return rangeValue(node.from, node.to, ctx);
    case "unary": {
      const arg = toNumber(evaluateNode(node.arg, ctx));
      if (arg instanceof FormulaError) return arg;
      return node.op === "-" ? -arg : arg;
    }
    case "binary":
      return binary(node.op, evaluateNode(node.left, ctx), evaluateNode(node.right, ctx), ctx);
    case "call":
      return call(node.name, node.args, ctx);
  }
}

function refValue(ref: Ref, ctx: Context): CellValue {
  if (!isInsideGrid(ref)) return new FormulaError("REF");
  return ctx.valueOf(cellKey(ref));
}

function rangeValue(from: Ref, to: Ref, ctx: Context): Result {
  if (!isInsideGrid(from) || !isInsideGrid(to)) return new FormulaError("REF");

  return new RangeValue(rectCells(rectOf(from, to)).map((pos) => ctx.valueOf(cellKey(pos))));
}

function binary(op: BinaryOperator, left: Result, right: Result, ctx: Context): CellValue {
  if (op === "&") return concat(left, right, ctx.locale);
  if (op === "+" || op === "-" || op === "*" || op === "/") return arithmetic(op, left, right);
  return compare(op, left, right);
}

function arithmetic(op: ArithmeticOperator, left: Result, right: Result): CellValue {
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

function concat(left: Result, right: Result, locale: Locale): CellValue {
  const a = toText(left, locale);
  if (a instanceof FormulaError) return a;
  const b = toText(right, locale);
  if (b instanceof FormulaError) return b;

  return a + b;
}

/**
 * Like in usual spreadsheets, texts are compared without taking case into account,
 * and numbers < texts < logical values.
 * An empty cell is equal to 0, to "" and to FALSE.
 */
function compare(op: ComparisonOperator, left: Result, right: Result): CellValue {
  const a = toScalar(left);
  if (a instanceof FormulaError) return a;
  const b = toScalar(right);
  if (b instanceof FormulaError) return b;

  const diff = compareValues(a ?? emptyLike(b), b ?? emptyLike(a));
  switch (op) {
    case "=":
      return diff === 0;
    case "<>":
      return diff !== 0;
    case "<":
      return diff < 0;
    case ">":
      return diff > 0;
    case "<=":
      return diff <= 0;
    case ">=":
      return diff >= 0;
  }
}

type Comparable = number | string | boolean;

/** Value of an empty cell when compared to `other`. */
function emptyLike(other: Comparable | null): Comparable {
  if (typeof other === "string") return "";
  if (typeof other === "boolean") return false;
  return 0;
}

function compareValues(a: Comparable, b: Comparable): number {
  const rankA = typeRank(a);
  const rankB = typeRank(b);
  if (rankA !== rankB) return rankA - rankB;
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, undefined, { sensitivity: "accent" });
  }
  return Number(a) - Number(b);
}

function typeRank(value: Comparable): number {
  if (typeof value === "number") return 0;
  if (typeof value === "string") return 1;
  return 2;
}

/** A range outside a function is an error. */
function toScalar(value: Result): CellValue {
  return value instanceof RangeValue ? new FormulaError("VALUE") : value;
}

/** Empty cells count as 0, TRUE as 1, FALSE as 0, text is an error. */
function toNumber(value: Result): number | FormulaError {
  const scalar = toScalar(value);
  if (scalar === null) return 0;
  if (typeof scalar === "boolean") return scalar ? 1 : 0;
  if (typeof scalar === "string") return new FormulaError("VALUE");
  return scalar;
}

function toText(value: Result, locale: Locale): string | FormulaError {
  const scalar = toScalar(value);
  if (scalar === null) return "";
  if (typeof scalar === "number") return formatNumber(scalar, locale);
  if (typeof scalar === "boolean") return scalar ? locale.booleans.TRUE : locale.booleans.FALSE;
  return scalar;
}

/** Empty cells and 0 are FALSE, other numbers are TRUE, text is an error. */
function toBoolean(value: Result): boolean | FormulaError {
  const scalar = toScalar(value);
  if (scalar === null) return false;
  if (typeof scalar === "number") return scalar !== 0;
  if (typeof scalar === "string") return new FormulaError("VALUE");
  return scalar;
}

function call(name: string, args: Node[], ctx: Context): CellValue {
  const fn = findFunction(name, CANONICAL);
  if (!fn) return new FormulaError("NAME");
  if (args.length === 0) return new FormulaError("VALUE");
  if (fn === "IF") return callIf(args, ctx);
  if (fn === "COUNTIF") return callCountIf(args, ctx);
  if (fn === "COUNTIFS") return callCountIfs(args, ctx);
  if (fn === "NOT") {
    if (args.length !== 1) return new FormulaError("VALUE");
    const arg = toBoolean(evaluateNode(args[0], ctx));
    return arg instanceof FormulaError ? arg : !arg;
  }

  const values = args.map((arg) =>
    // Like ranges, a single reference ignores text when used as an argument.
    arg.type === "ref" ? new RangeValue([refValue(arg.ref, ctx)]) : evaluateNode(arg, ctx),
  );
  return FUNCTIONS[fn](values);
}

/**
 * `IF(condition, valueIfTrue, valueIfFalse)`.
 * Only the chosen branch is evaluated: an error in the other one is ignored.
 * Without `valueIfFalse`, the result is FALSE.
 */
function callIf(args: Node[], ctx: Context): CellValue {
  if (args.length < 2 || args.length > 3) return new FormulaError("VALUE");

  const condition = toBoolean(evaluateNode(args[0], ctx));
  if (condition instanceof FormulaError) return condition;

  const branch = condition ? args[1] : args[2];
  return branch ? toScalar(evaluateNode(branch, ctx)) : false;
}

/**
 * `COUNTIF(range, criterion)`: number of cells of `range` that meet `criterion`.
 * The criterion can be a value (`5`, `"abc"`, `TRUE`) or a text starting
 * with a comparison operator (`">=10"`, `"<>abc"`).
 * Texts are compared without taking case into account and can use the
 * wildcards `*` (any sequence of chars) and `?` (any single char).
 */
function callCountIf(args: Node[], ctx: Context): CellValue {
  return args.length === 2 ? callCountIfs(args, ctx) : new FormulaError("VALUE");
}

/**
 * `COUNTIFS(range1, criterion1, range2, criterion2, ...)`: number of positions `i`
 * such that the i-th cell of every range meets the criterion of this range.
 * All the ranges must have the same size. Criteria are the same as in `COUNTIF`.
 */
function callCountIfs(args: Node[], ctx: Context): CellValue {
  if (args.length === 0 || args.length % 2 !== 0) return new FormulaError("VALUE");

  const conditions: Array<{ values: CellValue[]; matches: (value: CellValue) => boolean }> = [];
  for (let i = 0; i < args.length; i += 2) {
    const range = criterionRange(args[i], ctx);
    if (range instanceof FormulaError) return range;
    if (conditions.length > 0 && range.length !== conditions[0].values.length) {
      return new FormulaError("VALUE");
    }
    const criterion = toScalar(evaluateNode(args[i + 1], ctx));
    if (criterion instanceof FormulaError) return criterion;

    conditions.push({ values: range, matches: makeCriterion(criterion, ctx.locale) });
  }
  const size = conditions[0].values.length;
  let count = 0;
  for (let index = 0; index < size; index++) {
    if (conditions.every(({ values, matches }) => matches(values[index]))) count++;
  }
  return count;
}

/** Values of the range of a criterion: it must be a range or a reference. */
function criterionRange(arg: Node, ctx: Context): CellValue[] | FormulaError {
  const range =
    arg.type === "ref" ? new RangeValue([refValue(arg.ref, ctx)]) : evaluateNode(arg, ctx);
  if (range instanceof FormulaError) return range;
  return range instanceof RangeValue ? range.values : new FormulaError("VALUE");
}

const RX_CRITERION = /^(<>|<=|>=|=|<|>)?(.*)$/s;

function makeCriterion(
  criterion: Exclude<CellValue, FormulaError>,
  locale: Locale,
): (value: CellValue) => boolean {
  if (typeof criterion !== "string") {
    // An empty criterion (reference to an empty cell) matches 0, like in Excel.
    const expected = criterion ?? 0;
    return (value) => value === expected;
  }

  const [, op = "=", operand] = RX_CRITERION.exec(criterion) ?? [];
  const target = parseCriterionOperand(operand ?? "", locale);
  if (target === "") {
    // "=" matches empty cells, "<>" matches non-empty cells.
    if (op === "=") return (value) => value === null || value === "";
    if (op === "<>") return (value) => value !== null && value !== "";
  }
  return (value) => {
    if (value === null || value instanceof FormulaError) return op === "<>";
    if (typeof value !== typeof target) return op === "<>";
    if (typeof target === "string" && (op === "=" || op === "<>")) {
      return wildcardRegex(target).test(String(value)) === (op === "=");
    }
    const diff = compareValues(value, target);
    switch (op) {
      case "=":
        return diff === 0;
      case "<>":
        return diff !== 0;
      case "<":
        return diff < 0;
      case ">":
        return diff > 0;
      case "<=":
        return diff <= 0;
      default:
        return diff >= 0;
    }
  };
}

function parseCriterionOperand(text: string, locale: Locale): Comparable {
  const number = parseNumber(text, locale);
  if (number !== undefined) return number;

  const upper = text.toUpperCase();
  for (const names of [locale.booleans, CANONICAL.booleans]) {
    if (upper === names.TRUE) return true;
    if (upper === names.FALSE) return false;
  }
  return text;
}

/** `*` matches any sequence of chars, `?` any single char, `~` escapes them. */
function wildcardRegex(pattern: string): RegExp {
  let source = "";
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern.charAt(i);
    if (char === "~" && i + 1 < pattern.length) {
      i++;
      source += escapeRegex(pattern.charAt(i));
    } else if (char === "*") source += ".*";
    else if (char === "?") source += ".";
    else source += escapeRegex(char);
  }
  return new RegExp(`^${source}$`, "is");
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FUNCTIONS: Record<
  Exclude<FunctionName, "IF" | "NOT" | "COUNTIF" | "COUNTIFS">,
  (args: Result[]) => CellValue
> = {
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
  AND(args) {
    const conditions = logicalValues(args);
    return conditions instanceof FormulaError ? conditions : conditions.every(Boolean);
  },
  OR(args) {
    const conditions = logicalValues(args);
    return conditions instanceof FormulaError ? conditions : conditions.some(Boolean);
  },
};

/**
 * Sum and count the numbers of the arguments.
 * In ranges, text, logical values and empty cells are ignored. Errors are propagated.
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

/**
 * Conditions given to AND and OR.
 * In ranges, text and empty cells are ignored. Errors are propagated.
 * @returns `#VALUE!` if there is no condition at all.
 */
function logicalValues(args: Result[]): boolean[] | FormulaError {
  const conditions: boolean[] = [];
  for (const arg of args) {
    if (arg instanceof RangeValue) {
      for (const value of arg.values) {
        if (value instanceof FormulaError) return value;
        if (typeof value === "number" || typeof value === "boolean") {
          conditions.push(Boolean(value));
        }
      }
    } else {
      const condition = toBoolean(arg);
      if (condition instanceof FormulaError) return condition;
      conditions.push(condition);
    }
  }
  return conditions.length > 0 ? conditions : new FormulaError("VALUE");
}
