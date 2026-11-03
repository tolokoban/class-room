import { type EditorState, getSelection } from "./keyboard";
import { isSpace, type RichChar, type RichText } from "./rich-text";

export interface Target {
  text: RichText;
  plain: string;
  counts: Map<string, number>;
  /** Cache of the navigation distances, per text. */
  navCache: WeakMap<RichText, Int32Array>;
}

export function createTarget(text: RichText): Target {
  return { text, plain: toPlain(text), counts: countChars(text), navCache: new WeakMap() };
}

/**
 * To keep the search fast, we only keep the edits that make sense
 * to reach the target, as a human would do:
 * - edit only where the text differs from the target,
 * - delete only the characters that are in excess,
 * - insert (type or paste) only the missing characters,
 * - cut or copy only fragments of the target,
 * - change boldness only to fix whole groups of wrong characters.
 */
export function isRelevant(before: EditorState, after: EditorState, target: Target): boolean {
  if (after.clipboard !== before.clipboard) {
    if (!isFragment(after.clipboard, target)) return false;
    // Copying is only useful to paste missing characters.
    if (after.text === before.text && !isMissing(after.clipboard, after.text, target)) return false;
  }
  if (after.pendingBold !== null) return hasMissingChars(after.text, target);
  if (after.text === before.text) return true;
  if (!isInDiffRegion(before.text, after.text, target)) return false;

  if (toPlain(before.text) === toPlain(after.text)) return isUsefulBold(before, after, target);

  const isCut = after.clipboard !== before.clipboard;
  // Typing, deleting, cutting or pasting must extend the parts that already match the target.
  if (!extendsMatch(before.text, after.text, target)) return false;

  const countsBefore = countChars(before.text);
  const countsAfter = countChars(after.text);
  for (const char of new Set([...countsBefore.keys(), ...countsAfter.keys()])) {
    const countBefore = countsBefore.get(char) ?? 0;
    const countAfter = countsAfter.get(char) ?? 0;
    const expected = target.counts.get(char) ?? 0;
    // We tolerate one extra or missing space, for instance to move a word with its space.
    const slack = isSpace(char) ? 1 : 0;
    if (countAfter > countBefore && countAfter > expected + slack) return false;
    if (countAfter < countBefore && countAfter < expected - slack && !isCut) return false;
  }
  return true;
}

/**
 * @returns The range of `text` that differs from the target,
 * between their common prefix and their common suffix.
 */
export function getDiffRegion(text: RichText, target: Target): [from: number, to: number] {
  return getChangedRange(text, target.text, isSameLook);
}

/** @returns The number of groups of wrong boldness, if only the boldness is wrong. */
export function countBoldRuns(text: RichText, target: Target): number {
  return getBoldRuns(text, target.text).length;
}

function extendsMatch(before: RichText, after: RichText, target: Target): boolean {
  const [prefixBefore, suffixBefore] = getMatchLengths(before, target.text);
  const [prefixAfter, suffixAfter] = getMatchLengths(after, target.text);
  return prefixAfter > prefixBefore || suffixAfter > suffixBefore;
}

/** Lengths of the common prefix and of the common suffix (they can overlap). */
function getMatchLengths(text: RichText, expected: RichText): [prefix: number, suffix: number] {
  const min = Math.min(text.length, expected.length);
  let prefix = 0;
  while (prefix < min && isSameLook(text[prefix], expected[prefix])) prefix++;
  let suffix = 0;
  while (
    suffix < min &&
    isSameLook(text[text.length - 1 - suffix], expected[expected.length - 1 - suffix])
  ) {
    suffix++;
  }
  return [prefix, suffix];
}

/** The edit must take place in the part of the text that differs from the target. */
function isInDiffRegion(before: RichText, after: RichText, target: Target): boolean {
  const [regionFrom, regionTo] = getDiffRegion(before, target);
  const [from, to] = getChangedRange(before, after, isSameLook);
  return from >= regionFrom && to <= regionTo;
}

function isUsefulBold(before: EditorState, after: EditorState, target: Target): boolean {
  if (toPlain(after.text) !== target.plain) {
    const [from, to] = getSelection(after);
    return isFragment(after.text.slice(from, to), target);
  }
  // A good Ctrl-B fixes whole groups of wrong characters, without breaking anything.
  const errorsBefore = getBoldErrors(before.text, target.text);
  const errorsAfter = getBoldErrors(after.text, target.text);
  if (errorsAfter.some((error, index) => error && !errorsBefore[index])) return false;
  const runs = getBoldRuns(before.text, target.text);
  const fixed = runs.filter((run) => run.every((index) => !errorsAfter[index]));
  const touched = runs.filter((run) => run.some((index) => !errorsAfter[index]));
  return fixed.length > 0 && fixed.length === touched.length;
}

/**
 * Groups of consecutive characters with a wrong boldness (spaces are ignored).
 * Each group needs its own Ctrl-B.
 */
function getBoldRuns(text: RichText, expected: RichText): number[][] {
  const errors = getBoldErrors(text, expected);
  const runs: number[][] = [];
  let run: number[] | null = null;
  text.forEach(({ char }, index) => {
    if (isSpace(char)) return;
    if (!errors[index]) {
      run = null;
      return;
    }
    if (!run) {
      run = [];
      runs.push(run);
    }
    run.push(index);
  });
  return runs;
}

function getBoldErrors(text: RichText, expected: RichText): boolean[] {
  return text.map(({ char, bold }, index) => !isSpace(char) && bold !== expected[index]?.bold);
}

function getChangedRange(
  a: RichText,
  b: RichText,
  same: (x: RichChar, y: RichChar) => boolean,
): [from: number, to: number] {
  const min = Math.min(a.length, b.length);
  let prefix = 0;
  while (prefix < min && same(a[prefix], b[prefix])) prefix++;
  let suffix = 0;
  while (suffix < min - prefix && same(a[a.length - 1 - suffix], b[b.length - 1 - suffix])) {
    suffix++;
  }
  return [prefix, a.length - suffix];
}

/** The boldness of spaces cannot be seen. */
function isSameLook(x: RichChar, y: RichChar): boolean {
  return x.char === y.char && (x.bold === y.bold || isSpace(x.char));
}

/** Is `fragment` (with its boldness, ignoring surrounding spaces) a part of the target? */
function isFragment(fragment: RichText, target: Target): boolean {
  const trimmed = trim(fragment);
  // Only spaces are not worth a clipboard.
  if (trimmed.length === 0) return false;
  if (trimmed !== fragment) return isFragment(trimmed, target);

  const plain = toPlain(fragment);
  let index = target.plain.indexOf(plain);
  while (index > -1) {
    const ok = fragment.every(
      ({ char, bold }, offset) => isSpace(char) || target.text[index + offset].bold === bold,
    );
    if (ok) return true;
    index = target.plain.indexOf(plain, index + 1);
  }
  return false;
}

/** Are all the characters of `fragment` missing in `text`? */
function isMissing(fragment: RichText, text: RichText, target: Target): boolean {
  const counts = countChars(text);
  const needed = countChars(fragment);
  for (const [char, count] of needed) {
    const missing = (target.counts.get(char) ?? 0) - (counts.get(char) ?? 0);
    // We tolerate one extra space, for instance to copy a word with its space.
    const slack = isSpace(char) ? 1 : 0;
    if (count > missing + slack) return false;
  }
  return true;
}

export function hasMissingChars(text: RichText, target: Target): boolean {
  const counts = countChars(text);
  for (const [char, count] of target.counts) {
    if ((counts.get(char) ?? 0) < count) return true;
  }
  return false;
}

function trim(text: RichText): RichText {
  let from = 0;
  let to = text.length;
  while (from < to && isSpace(text[from].char)) from++;
  while (to > from && isSpace(text[to - 1].char)) to--;
  return from === 0 && to === text.length ? text : text.slice(from, to);
}

/** Texts are immutable, so we can cache what we compute from them. */
const countsCache = new WeakMap<RichText, Map<string, number>>();
const plainCache = new WeakMap<RichText, string>();

export function countChars(text: RichText): Map<string, number> {
  let counts = countsCache.get(text);
  if (counts) return counts;

  counts = new Map<string, number>();
  for (const { char } of text) counts.set(char, (counts.get(char) ?? 0) + 1);
  countsCache.set(text, counts);
  return counts;
}

export function toPlain(text: RichText): string {
  let plain = plainCache.get(text);
  if (plain !== undefined) return plain;

  plain = text.map(({ char }) => char).join("");
  plainCache.set(text, plain);
  return plain;
}
