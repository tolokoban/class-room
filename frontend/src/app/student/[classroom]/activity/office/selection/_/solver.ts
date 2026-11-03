import { estimate } from "./heuristic";
import {
  applyKey,
  createEditorState,
  type EditorState,
  type KeyStroke,
  lineStart,
} from "./keyboard";
import { countChars, createTarget, isRelevant, type Target } from "./relevance";
import { type RichText } from "./rich-text";
import { stroke, strokeId } from "./strokes";

/** Above this number of explored states, we give up. */
const MAX_STATES = 1_000_000;

const NAVIGATION: KeyStroke[] = [
  ...["ArrowLeft", "ArrowRight", "Home", "End"].flatMap((key) => [
    stroke(key),
    stroke(key, { ctrl: true }),
  ]),
  stroke("ArrowUp"),
  stroke("ArrowDown"),
];

const COMMANDS: KeyStroke[] = [
  ...NAVIGATION,
  ...NAVIGATION.map((item) => ({ ...item, shift: true })),
  stroke("Backspace"),
  stroke("Backspace", { ctrl: true }),
  stroke("Delete"),
  stroke("Delete", { ctrl: true }),
  stroke("a", { ctrl: true }),
  stroke("b", { ctrl: true }),
  stroke("c", { ctrl: true }),
  stroke("x", { ctrl: true }),
  stroke("v", { ctrl: true }),
];

interface Node {
  state: EditorState;
  depth: number;
  /** Estimation of the remaining number of strokes. */
  remaining: number;
  closed: boolean;
  /** All the ways to reach this node with a minimal number of strokes. */
  parents: Array<{ node: Node; stroke: KeyStroke }>;
}

/**
 * Graph of all the shortest paths from the input text to the expected one.
 */
export interface Solutions {
  /** Minimal number of keystrokes. */
  length: number;
  goals: Node[];
}

/**
 * A* search of all the shortest ways to transform `input` into `expected`.
 * @returns `null` if no solution has been found in a reasonable time.
 */
export function solve(input: RichText, expected: RichText): Solutions | null {
  const target = createTarget(expected);
  const visited = new Map<string, Node>();
  /** `buckets[f]` holds the nodes with `depth + remaining === f`. */
  const buckets: Node[][] = [];
  const open = (node: Node) => {
    const f = node.depth + node.remaining;
    (buckets[f] ??= []).push(node);
  };
  const start = createNode(createEditorState(input), 0, target);
  visited.set(stateKey(start.state), start);
  open(start);
  const goals: Node[] = [];
  for (let f = 0; f < buckets.length && goals.length === 0; f++) {
    const bucket = buckets[f] ?? [];
    while (bucket.length > 0) {
      const node = bucket.pop();
      if (!node || node.closed) continue;

      node.closed = true;
      if (node.remaining === 0) {
        goals.push(node);
        continue;
      }
      if (visited.size > MAX_STATES) return null;

      for (const item of getStrokes(node.state, target)) {
        const state = applyKey(node.state, item);
        if (!state || !isRelevant(node.state, state, target)) continue;

        const child = normalize(state);
        const key = stateKey(child);
        const depth = node.depth + 1;
        const existing = visited.get(key);
        if (existing && existing.depth < depth) continue;
        if (existing && existing.depth === depth) {
          existing.parents.push({ node, stroke: item });
          continue;
        }
        const childNode = createNode(child, depth, target);
        childNode.parents.push({ node, stroke: item });
        visited.set(key, childNode);
        open(childNode);
      }
    }
  }
  return goals.length > 0 ? { length: goals[0].depth, goals } : null;
}

/**
 * Among all the shortest solutions, pick the one that looks the most
 * like what the student did: the one using the most keys the student used.
 */
export function pickSolution(solutions: Solutions, studentStrokes: KeyStroke[]): KeyStroke[] {
  const used = new Set(studentStrokes.map(strokeId));
  const best = new Map<Node, { score: number; path: KeyStroke[] }>();
  const bestPathTo = (node: Node): { score: number; path: KeyStroke[] } => {
    const cached = best.get(node);
    if (cached) return cached;

    let result: { score: number; path: KeyStroke[] } | null = null;
    for (const { node: parent, stroke: item } of node.parents) {
      const candidate = bestPathTo(parent);
      const score = candidate.score + (used.has(strokeId(item)) ? 1 : 0);
      if (!result || score > result.score) result = { score, path: [...candidate.path, item] };
    }
    result ??= { score: 0, path: [] };
    best.set(node, result);
    return result;
  };
  const paths = solutions.goals.map(bestPathTo);
  paths.sort((a, b) => b.score - a.score);
  return paths[0]?.path ?? [];
}

/**
 * Forget the history, and the goal column when it is the actual column,
 * to merge states that behave the same.
 */
function normalize(state: EditorState): EditorState {
  const { goalColumn, cursor, text } = state;
  const useless = goalColumn !== null && goalColumn === cursor - lineStart(text, cursor);
  return { ...state, goalColumn: useless ? null : goalColumn, undo: [], redo: [] };
}

function createNode(state: EditorState, depth: number, target: Target): Node {
  return { state, depth, remaining: estimate(state, target), closed: false, parents: [] };
}

function getStrokes(state: EditorState, target: Target): KeyStroke[] {
  const strokes = [...COMMANDS];
  // Typing a character is only useful if the text lacks it.
  const current = countChars(state.text);
  for (const [char, count] of target.counts) {
    if ((current.get(char) ?? 0) >= count) continue;
    strokes.push(char === "\n" ? stroke("Enter") : stroke(char));
  }
  return strokes;
}

function stateKey({ text, cursor, anchor, goalColumn, pendingBold, clipboard }: EditorState) {
  return [
    cursor,
    anchor,
    goalColumn ?? "",
    pendingBold ?? "",
    serialize(text),
    serialize(clipboard),
  ].join("|");
}

/** The navigation does not change the text, so we can cache its serialization. */
const cache = new WeakMap<RichText, string>();

function serialize(text: RichText): string {
  const cached = cache.get(text);
  if (cached !== undefined) return cached;

  let out = "";
  for (const { char, bold } of text) out += bold ? `\u0001${char}` : char;
  cache.set(text, out);
  return out;
}
