import { columnIndex, columnName } from "./address";
import {
  acceptedDecimals,
  acceptedSeparators,
  type ErrorCode,
  findBoolean,
  findError,
  findFunction,
  formatNumber,
  type Locale,
} from "./locale";

/** Reference to a cell, with its absolute (`$`) markers. Zero-based. */
export interface Ref {
  col: number;
  row: number;
  colAbs: boolean;
  rowAbs: boolean;
}

export type Operator =
  | "+"
  | "-"
  | "*"
  | "/"
  | "&"
  | "("
  | ")"
  | ":"
  | "="
  | "<>"
  | "<"
  | ">"
  | "<="
  | ">=";

export type Token =
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "ref"; ref: Ref }
  /** Name followed by a "(". */
  | { type: "function"; name: string }
  /** Unknown name. */
  | { type: "name"; text: string }
  | { type: "op"; text: Operator }
  | { type: "separator" }
  | { type: "error"; code: ErrorCode }
  | { type: "space"; text: string }
  /** Unexpected character. */
  | { type: "invalid"; text: string };

const RX_SPACE = /^\s+/;
const RX_IDENTIFIER = /^[\p{L}_][\p{L}0-9_.]*/u;
const RX_REF = /^(\$?)([A-Za-z]{1,3})(\$?)([1-9]\d*)$/;
const RX_ABSOLUTE_REF = /^\$?[A-Za-z]{1,3}\$?[1-9]\d*/;
const RX_ERROR = /^#[A-Za-z0-9/]+[!?]/;
const OPERATORS = "+-*/&():=<>";
const RX_STRING = /^"(?:[^"]|"")*"/;

/**
 * Split the text of a formula (without the leading "=") into tokens.
 * Tokenizing never fails: unexpected characters give "invalid" tokens.
 */
export function tokenize(text: string, locale: Locale): Token[] {
  const tokens: Token[] = [];
  const separators = acceptedSeparators(locale);
  const rxNumber = makeNumberRegex(locale);
  let rest = text;
  while (rest.length > 0) {
    const [token, length] = nextToken(rest, locale, separators, rxNumber);
    tokens.push(token);
    rest = rest.slice(length);
  }
  return tokens;
}

function nextToken(
  text: string,
  locale: Locale,
  separators: string[],
  rxNumber: RegExp,
): [token: Token, length: number] {
  const char = text.charAt(0);
  const space = RX_SPACE.exec(text);
  if (space) return [{ type: "space", text: space[0] }, space[0].length];

  if (separators.includes(char)) return [{ type: "separator" }, 1];

  if (char === '"') return nextString(text);

  if (OPERATORS.includes(char)) {
    const pair = text.slice(0, 2);
    if (pair === "<>" || pair === "<=" || pair === ">=") return [{ type: "op", text: pair }, 2];

    return [{ type: "op", text: char as Operator }, 1];
  }
  const number = rxNumber.exec(text);
  if (number) {
    return [{ type: "number", value: Number(number[0].replace(",", ".")) }, number[0].length];
  }
  if (char === "#") return nextError(text, locale);

  const ref = nextRef(text);
  if (ref) return ref;

  const identifier = RX_IDENTIFIER.exec(text);
  if (identifier) return [identifierToken(identifier[0], text, locale), identifier[0].length];

  return [{ type: "invalid", text: char }, 1];
}

/** References can contain "$", that is not allowed in identifiers. */
function nextRef(text: string): [token: Token, length: number] | undefined {
  const match = RX_ABSOLUTE_REF.exec(text);
  if (!match) return undefined;

  const after = text.slice(match[0].length);
  // "ANZAHL2(" is a function, "A1B" is a name.
  if (/^[\p{L}0-9_.]/u.test(after) || after.trimStart().startsWith("(")) return undefined;

  const ref = parseRef(match[0]);
  return ref ? [{ type: "ref", ref }, match[0].length] : undefined;
}

/** Text between double quotes. Inside, `""` stands for one `"`. */
function nextString(text: string): [token: Token, length: number] {
  const match = RX_STRING.exec(text);
  // Unterminated string: the rest of the formula is invalid.
  if (!match) return [{ type: "invalid", text }, text.length];

  return [{ type: "string", value: match[0].slice(1, -1).replace(/""/g, '"') }, match[0].length];
}

function nextError(text: string, locale: Locale): [token: Token, length: number] {
  const match = RX_ERROR.exec(text);
  const code = match ? findError(match[0], locale) : undefined;
  if (!match || !code) return [{ type: "invalid", text: "#" }, 1];

  return [{ type: "error", code }, match[0].length];
}

function identifierToken(identifier: string, text: string, locale: Locale): Token {
  const after = text.slice(identifier.length).trimStart();
  if (after.startsWith("(")) return { type: "function", name: identifier };

  const boolean = findBoolean(identifier, locale);
  if (boolean !== undefined) return { type: "boolean", value: boolean };

  return { type: "name", text: identifier };
}

/** Parse "A1", "$A1", "A$1" or "$A$1". */
export function parseRef(text: string): Ref | undefined {
  const match = RX_REF.exec(text);
  if (!match) return undefined;

  const [, colAbs, col, rowAbs, row] = match;
  return {
    col: columnIndex(col),
    row: Number(row) - 1,
    colAbs: colAbs === "$",
    rowAbs: rowAbs === "$",
  };
}

export function formatRef({ col, row, colAbs, rowAbs }: Ref): string {
  return `${colAbs ? "$" : ""}${columnName(col)}${rowAbs ? "$" : ""}${row + 1}`;
}

function makeNumberRegex(locale: Locale): RegExp {
  const decimals = acceptedDecimals(locale)
    .map((char) => `\\${char}`)
    .join("");
  return new RegExp(`^(\\d+([${decimals}]\\d+)?|[${decimals}]\\d+)`);
}

/**
 * Write tokens back as text, using the names, separators and decimal mark of `locale`.
 * Functions and errors names are translated, references are in uppercase.
 */
export function stringify(tokens: Token[], from: Locale, to: Locale): string {
  return tokens.map((token) => stringifyToken(token, from, to)).join("");
}

function stringifyToken(token: Token, from: Locale, to: Locale): string {
  switch (token.type) {
    case "number":
      return formatNumber(token.value, to);
    case "string":
      return `"${token.value.replace(/"/g, '""')}"`;
    case "boolean":
      return token.value ? to.booleans.TRUE : to.booleans.FALSE;
    case "ref":
      return formatRef(token.ref);
    case "function": {
      const fn = findFunction(token.name, from);
      return fn ? to.functions[fn] : token.name.toUpperCase();
    }
    case "name":
      return token.text;
    case "op":
      return token.text;
    case "separator":
      return to.separator;
    case "error":
      return to.errors[token.code];
    case "space":
    case "invalid":
      return token.text;
  }
}
