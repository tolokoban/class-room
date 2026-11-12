export const FUNCTION_NAMES = [
  "SUM",
  "COUNT",
  "COUNTA",
  "AVERAGE",
  "IF",
  "AND",
  "OR",
  "NOT",
] as const;
export type FunctionName = (typeof FUNCTION_NAMES)[number];

export const ERROR_CODES = ["DIV0", "NAME", "REF", "VALUE", "CIRC", "SYNTAX"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/**
 * Everything that depends on the language of the user
 * when typing or displaying a formula.
 */
export interface Locale {
  /** Decimal separator of the numbers. */
  decimal: "." | ",";
  /** Separator of the arguments of a function. */
  separator: "," | ";";
  /** Localized names of the functions, in uppercase. */
  functions: Record<FunctionName, string>;
  /** Localized names of the errors. */
  errors: Record<ErrorCode, string>;
  /** Localized names of the logical values, in uppercase. */
  booleans: { TRUE: string; FALSE: string };
}

/** The locale used to store formulas. */
export const CANONICAL: Locale = {
  decimal: ".",
  separator: ",",
  functions: {
    SUM: "SUM",
    COUNT: "COUNT",
    COUNTA: "COUNTA",
    AVERAGE: "AVERAGE",
    IF: "IF",
    AND: "AND",
    OR: "OR",
    NOT: "NOT",
  },
  errors: {
    DIV0: "#DIV/0!",
    NAME: "#NAME?",
    REF: "#REF!",
    VALUE: "#VALUE!",
    CIRC: "#CIRC!",
    SYNTAX: "#ERROR!",
  },
  booleans: { TRUE: "TRUE", FALSE: "FALSE" },
};

/** Find the function from its localized name (english names are accepted too). */
export function findFunction(name: string, locale: Locale): FunctionName | undefined {
  const upper = name.toUpperCase();
  return (
    FUNCTION_NAMES.find((fn) => locale.functions[fn] === upper) ??
    FUNCTION_NAMES.find((fn) => CANONICAL.functions[fn] === upper)
  );
}

/** Find the logical value from its localized name (english names are accepted too). */
export function findBoolean(name: string, locale: Locale): boolean | undefined {
  const upper = name.toUpperCase();
  for (const names of [locale.booleans, CANONICAL.booleans]) {
    if (names.TRUE === upper) return true;
    if (names.FALSE === upper) return false;
  }
  return undefined;
}

/** Find the error code from its localized name (english names are accepted too). */
export function findError(name: string, locale: Locale): ErrorCode | undefined {
  const upper = name.toUpperCase();
  return (
    ERROR_CODES.find((code) => locale.errors[code] === upper) ??
    ERROR_CODES.find((code) => CANONICAL.errors[code] === upper)
  );
}

/** Decimal separators accepted when typing a number. */
export function acceptedDecimals(locale: Locale): string[] {
  return locale.decimal === "," ? [",", "."] : ["."];
}

/** Arguments separators accepted when typing a formula. */
export function acceptedSeparators(locale: Locale): string[] {
  return locale.separator === "," ? [",", ";"] : [";"];
}

export function formatNumber(value: number, locale: Locale): string {
  // Get rid of floating point noise, like in 0.1 + 0.2.
  const text = String(Number(value.toPrecision(12)));
  return locale.decimal === "," ? text.replace(".", ",") : text;
}

/**
 * @returns The number written in `text`, or `undefined` if it is not a number.
 */
export function parseNumber(text: string, locale: Locale): number | undefined {
  const decimals = acceptedDecimals(locale)
    .map((char) => `\\${char}`)
    .join("");
  const regex = new RegExp(`^[+-]?(\\d+([${decimals}]\\d*)?|[${decimals}]\\d+)$`);
  const trimmed = text.trim();
  if (!regex.test(trimmed)) return undefined;

  return Number(trimmed.replace(",", "."));
}
