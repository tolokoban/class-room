import { applyKey, type EditorState } from "./keyboard";
import { computeNavDistances, widenWithSpaces } from "./nav";
import {
  countBoldRuns,
  countChars,
  getDiffRegion,
  isRelevant,
  type Target,
  toPlain,
} from "./relevance";
import { isSpace, type RichText, richTextEquals } from "./rich-text";
import { stroke } from "./strokes";

const CTRL_B = stroke("b", { ctrl: true });
const CTRL_V = stroke("v", { ctrl: true });

/**
 * Lower bound of the number of strokes needed to reach the target,
 * with the edits allowed by `isRelevant()`.
 */
export function estimate(state: EditorState, target: Target): number {
  if (richTextEquals(state.text, target.text)) return 0;
  if (isFixedBy(state, CTRL_V, target)) return 1;
  if (toPlain(state.text) === target.plain) {
    // Each group of wrong boldness needs a selection, then Ctrl-B.
    // Except if the current selection is ready for Ctrl-B.
    const ready = isRelevantKey(state, CTRL_B, target) ? 1 : 0;
    return 2 * countBoldRuns(state.text, target) - ready;
  }
  // Edits only happen where the text differs from the target.
  const travel = estimateTravel(state, target);
  if (state.clipboard.length === 0 && isShuffled(state.text, target)) {
    // The characters are right, but not in the right order:
    // we must remove some, move, then insert them back.
    return 3 + travel;
  }
  // Without pasting, each missing character must be typed.
  const canPaste = state.clipboard.length > 0;
  const edits = !canPaste && countMissingChars(state, target) >= 2 ? 2 : 1;
  return edits + travel;
}

/**
 * Minimal number of strokes to bring the cursor (or go back to the anchor)
 * where the text differs from the target.
 */
function estimateTravel(state: EditorState, target: Target): number {
  const distances = getNavDistances(state.text, target);
  return Math.max(0, Math.min(distances[state.cursor], distances[state.anchor]));
}

function getNavDistances(text: RichText, target: Target): Int32Array {
  let distances = target.navCache.get(text);
  if (!distances) {
    const [from, to] = widenWithSpaces(text, ...getDiffRegion(text, target));
    distances = computeNavDistances(text, from, to);
    target.navCache.set(text, distances);
  }
  return distances;
}

/** Are the visible characters right, but not in the right order? */
function isShuffled(text: RichText, target: Target): boolean {
  const visible = toPlain(text).replace(/\s+/gu, "");
  const expected = target.plain.replace(/\s+/gu, "");
  if (visible === expected) return false;
  const counts = countChars(text);
  for (const [char, count] of target.counts) {
    if (!isSpace(char) && counts.get(char) !== count) return false;
  }
  for (const [char, count] of counts) {
    if (!isSpace(char) && target.counts.get(char) !== count) return false;
  }
  return true;
}

function isRelevantKey(state: EditorState, item: typeof CTRL_B, target: Target): boolean {
  const next = applyKey(state, item);
  return next !== null && isRelevant(state, next, target);
}

function isFixedBy(state: EditorState, item: typeof CTRL_B, target: Target): boolean {
  const next = applyKey(state, item);
  return next !== null && richTextEquals(next.text, target.text);
}

function countMissingChars(state: EditorState, target: Target): number {
  const counts = countChars(state.text);
  let missing = 0;
  for (const [char, count] of target.counts) {
    missing += Math.max(0, count - (counts.get(char) ?? 0));
  }
  return missing;
}
