import {
  type CellPos,
  type Cells,
  cellKey,
  isInsideGrid,
  type Rect,
  rectContains,
} from "./address";
import { CANONICAL, parseNumber } from "./locale";
import { stringify, type Token, tokenize } from "./tokenizer";

/**
 * When the fill handle of `source` is dragged to `pos`,
 * the source is extended along one axis only (the one with the greatest distance).
 * @returns The extended rectangle, or `null` if `pos` is inside the source.
 */
export function computeFillTarget(source: Rect, pos: CellPos): Rect | null {
  if (rectContains(source, pos)) return null;

  const dRow =
    pos.row > source.bottom ? pos.row - source.bottom : Math.min(0, pos.row - source.top);
  const dCol = pos.col > source.right ? pos.col - source.right : Math.min(0, pos.col - source.left);
  if (Math.abs(dRow) >= Math.abs(dCol)) {
    return dRow > 0 ? { ...source, bottom: pos.row } : { ...source, top: pos.row };
  }
  return dCol > 0 ? { ...source, right: pos.col } : { ...source, left: pos.col };
}

/**
 * Fill the cells of `target` that are not in `source`, like Excel or LibreOffice Calc do:
 * - a line of 2+ numbers is extended as a linear series (1, 2 → 3, 4, 5...),
 * - text ending with a number is incremented ("Item 1" → "Item 2"),
 * - formulas are copied, their relative references being shifted,
 * - anything else is copied.
 *
 * The source pattern is repeated as many times as needed.
 * @param target - Extension of `source` along one axis.
 */
export function fill(cells: Cells, source: Rect, target: Rect): Cells {
  const result = { ...cells };
  const vertical = target.top !== source.top || target.bottom !== source.bottom;
  const forward = vertical ? target.bottom > source.bottom : target.right > source.right;
  const count = vertical
    ? target.bottom - target.top - (source.bottom - source.top)
    : target.right - target.left - (source.right - source.left);
  const [lineStart, lineEnd] = vertical ? [source.left, source.right] : [source.top, source.bottom];
  const [first, last] = vertical ? [source.top, source.bottom] : [source.left, source.right];
  const posOf = (line: number, index: number): CellPos =>
    vertical ? { col: line, row: first + index } : { col: first + index, row: line };
  for (let line = lineStart; line <= lineEnd; line++) {
    const raws: string[] = [];
    for (let index = 0; index <= last - first; index++) {
      raws.push(cells[cellKey(posOf(line, index))] ?? "");
    }
    for (let step = 1; step <= count; step++) {
      const index = forward ? raws.length - 1 + step : -step;
      const raw = fillLine(raws, index, vertical);
      const key = cellKey(posOf(line, index));
      if (raw === "") delete result[key];
      else result[key] = raw;
    }
  }
  return result;
}

/**
 * @param raws - Source cells of the line.
 * @param index - Position of the cell to fill, relative to the first source cell.
 * Negative when filling upward or leftward.
 */
function fillLine(raws: string[], index: number, vertical: boolean): string {
  const numbers = raws.map((raw) => parseNumber(raw, CANONICAL));
  if (raws.length > 1 && numbers.every((value) => value !== undefined)) {
    return formatSeriesValue(linearTrend(numbers as number[], index));
  }
  const size = raws.length;
  const sourceIndex = ((index % size) + size) % size;
  const raw = raws[sourceIndex];
  const delta = index - sourceIndex;
  if (raw.startsWith("=")) {
    return vertical ? shiftFormula(raw, delta, 0) : shiftFormula(raw, 0, delta);
  }
  if (numbers[sourceIndex] !== undefined) return raw;

  return incrementText(raw, Math.floor(index / size));
}

/** Least squares linear regression, like Excel does for series. */
function linearTrend(values: number[], index: number): number {
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / n;
  let num = 0;
  let den = 0;
  values.forEach((value, x) => {
    num += (x - meanX) * (value - meanY);
    den += (x - meanX) * (x - meanX);
  });
  const slope = num / den;
  return meanY + slope * (index - meanX);
}

function formatSeriesValue(value: number): string {
  return `${Number(value.toPrecision(12))}`;
}

/** "Item 1" + 2 → "Item 3". Leading zeros are kept: "x01" + 1 → "x02". */
function incrementText(text: string, increment: number): string {
  const match = /^(.*?)(\d+)$/.exec(text);
  if (!match) return text;

  const [, prefix, digits] = match;
  const value = Math.abs(Number(digits) + increment);
  return `${prefix}${`${value}`.padStart(digits.length, "0")}`;
}

/**
 * Shift the relative references of a formula.
 * References that go out of the grid are replaced by `#REF!`.
 */
export function shiftFormula(raw: string, dRow: number, dCol: number): string {
  const tokens = tokenize(raw.slice(1), CANONICAL).map((token): Token => {
    if (token.type !== "ref") return token;

    const ref = {
      ...token.ref,
      col: token.ref.colAbs ? token.ref.col : token.ref.col + dCol,
      row: token.ref.rowAbs ? token.ref.row : token.ref.row + dRow,
    };
    return isInsideGrid(ref) ? { type: "ref", ref } : { type: "error", code: "REF" };
  });
  return `=${stringify(tokens, CANONICAL, CANONICAL)}`;
}
