import { lineEnd, lineStart, wordLeft, wordRight } from "./keyboard";
import { isSpace, type RichText } from "./rich-text";

/**
 * For each cursor position of `text`, a lower bound of the number of
 * strokes needed to put the cursor in the range `[from, to]`.
 * To never overestimate, ↑ and ↓ are allowed to reach any column
 * of the previous or next line.
 */
export function computeNavDistances(text: RichText, from: number, to: number): Int32Array {
  const count = text.length + 1;
  const reverse: number[][] = Array.from({ length: count }, () => []);
  const lines = getLines(text);
  const lineOf = new Int32Array(count);
  lines.forEach(([start, end], line) => {
    for (let pos = start; pos <= end; pos++) lineOf[pos] = line;
  });
  for (let pos = 0; pos < count; pos++) {
    const targets = [
      Math.max(0, pos - 1),
      Math.min(text.length, pos + 1),
      wordLeft(text, pos),
      wordRight(text, pos),
      lineStart(text, pos),
      lineEnd(text, pos),
      0,
      text.length,
    ];
    for (const neighbour of [lines[lineOf[pos] - 1], lines[lineOf[pos] + 1]]) {
      if (!neighbour) continue;
      for (let other = neighbour[0]; other <= neighbour[1]; other++) targets.push(other);
    }
    for (const target of targets) reverse[target].push(pos);
  }
  const distances = new Int32Array(count).fill(-1);
  const queue: number[] = [];
  for (let pos = Math.max(0, from); pos <= Math.min(text.length, to); pos++) {
    distances[pos] = 0;
    queue.push(pos);
  }
  for (let index = 0; index < queue.length; index++) {
    const pos = queue[index];
    for (const previous of reverse[pos]) {
      if (distances[previous] > -1) continue;
      distances[previous] = distances[pos] + 1;
      queue.push(previous);
    }
  }
  return distances;
}

/**
 * Widen `[from, to]` with the surrounding spaces,
 * because their boldness can change without being visible.
 */
export function widenWithSpaces(text: RichText, from: number, to: number): [number, number] {
  let start = from;
  let end = to;
  while (start > 0 && isSpace(text[start - 1].char) && text[start - 1].char !== "\n") start--;
  while (end < text.length && isSpace(text[end].char) && text[end].char !== "\n") end++;
  return [start, end];
}

function getLines(text: RichText): Array<[start: number, end: number]> {
  const lines: Array<[number, number]> = [];
  let start = 0;
  text.forEach(({ char }, index) => {
    if (char !== "\n") return;
    lines.push([start, index]);
    start = index + 1;
  });
  lines.push([start, text.length]);
  return lines;
}
