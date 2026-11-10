import { type CellValue, FormulaError } from "./evaluate";
import { CANONICAL, formatNumber, type Locale, parseNumber } from "./locale";
import { stringify, tokenize } from "./tokenizer";

/**
 * Convert what the user typed into what is stored in the cell:
 * formulas use english names, numbers use a dot as decimal separator.
 */
export function toCanonical(input: string, locale: Locale): string {
  if (input.trim() === "") return "";
  if (input.startsWith("=")) {
    return `=${stringify(tokenize(input.slice(1), locale), locale, CANONICAL)}`;
  }
  const number = parseNumber(input, locale);
  return number === undefined ? input : `${number}`;
}

/** Convert the stored content of a cell into what the user can edit. */
export function toLocal(raw: string, locale: Locale): string {
  if (raw.startsWith("=")) {
    return `=${stringify(tokenize(raw.slice(1), CANONICAL), CANONICAL, locale)}`;
  }
  const number = parseNumber(raw, CANONICAL);
  return number === undefined ? raw : formatNumber(number, locale);
}

/** Text displayed in a cell of the grid. */
export function formatValue(value: CellValue, locale: Locale): string {
  if (value === null) return "";
  if (typeof value === "number") return formatNumber(value, locale);
  if (value instanceof FormulaError) return locale.errors[value.code];
  return value;
}
