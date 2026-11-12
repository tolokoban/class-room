import { FUNCTION_NAMES, type FunctionName, type Locale } from "./locale";

export interface Completion {
  /** Position of the first char of the word being typed. */
  start: number;
  /** Position of the end of the word (the caret). */
  end: number;
  /** Functions whose localized name starts with the word. */
  functions: FunctionName[];
}

/**
 * @returns The functions that could complete the word typed just before the caret,
 * or `null` if there is nothing to suggest.
 */
export function findCompletion(text: string, caret: number, locale: Locale): Completion | null {
  if (!text.startsWith("=")) return null;
  // The caret must be at the end of the word.
  if (/^[\p{L}0-9_.]/u.test(text.slice(caret))) return null;

  // No suggestion inside a text between double quotes.
  if ((text.slice(0, caret).split('"').length - 1) % 2 === 1) return null;

  const match = /[\p{L}_][\p{L}0-9_.]*$/u.exec(text.slice(1, caret));
  if (!match) return null;

  const start = 1 + match.index;
  // "$A" is the beginning of a reference.
  if (text.charAt(start - 1) === "$") return null;

  const prefix = match[0].toUpperCase();
  const functions = FUNCTION_NAMES.filter((fn) => locale.functions[fn].startsWith(prefix));
  return functions.length > 0 ? { start, end: caret, functions } : null;
}

/**
 * Replace the word being typed by the localized name of the function and a "(".
 * @returns The new text and the new position of the caret.
 */
export function applyCompletion(
  text: string,
  { start, end }: Completion,
  fn: FunctionName,
  locale: Locale,
): { text: string; caret: number } {
  const after = text.slice(end);
  const insert = after.startsWith("(") ? locale.functions[fn] : `${locale.functions[fn]}(`;
  const caret = start + insert.length + (after.startsWith("(") ? 1 : 0);
  return { text: text.slice(0, start) + insert + after, caret };
}
