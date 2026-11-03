import { isSpace, type RichText } from "./rich-text";

/** Maximum number of undo steps. */
const HISTORY = 200;

export interface KeyStroke {
  key: string;
  /** Ctrl on Windows/Linux, Cmd on Mac. */
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

interface Snapshot {
  text: RichText;
  cursor: number;
  anchor: number;
}

export interface EditorState extends Snapshot {
  /** Column to aim at when moving up and down. */
  goalColumn: number | null;
  /** Boldness of the next typed character, after Ctrl-B without selection. */
  pendingBold: boolean | null;
  clipboard: RichText;
  undo: Snapshot[];
  redo: Snapshot[];
}

export function createEditorState(text: RichText): EditorState {
  return {
    text,
    cursor: 0,
    anchor: 0,
    goalColumn: null,
    pendingBold: null,
    clipboard: [],
    undo: [],
    redo: [],
  };
}

export function getSelection({ cursor, anchor }: Snapshot): [from: number, to: number] {
  return [Math.min(cursor, anchor), Math.max(cursor, anchor)];
}

/**
 * Apply a keystroke to the editor.
 * @returns The new state, or `null` if the keystroke is not handled.
 */
export function applyKey(state: EditorState, stroke: KeyStroke): EditorState | null {
  return (
    applyShortcut(state, stroke) ?? applyNavigation(state, stroke) ?? applyEdition(state, stroke)
  );
}

function applyShortcut(state: EditorState, { key, ctrl, shift }: KeyStroke): EditorState | null {
  if (ctrl) {
    switch (key.toLowerCase()) {
      case "a":
        return {
          ...state,
          anchor: 0,
          cursor: state.text.length,
          goalColumn: null,
          pendingBold: null,
        };
      case "b":
        return toggleBold(state);
      case "c":
        return copy(state);
      case "x":
        return cut(state);
      case "v":
        return paste(state);
      case "z":
        return shift ? redo(state) : undo(state);
      case "y":
        return redo(state);
      case "insert":
        return copy(state);
    }
  }
  if (shift && key === "Insert") return paste(state);
  if (shift && key === "Delete") return cut(state);
  return null;
}

function applyNavigation(
  state: EditorState,
  { key, ctrl, shift, alt }: KeyStroke,
): EditorState | null {
  const { text, cursor } = state;
  const [from, to] = getSelection(state);
  const collapse = from !== to && !shift;
  const word = ctrl || alt;
  switch (key) {
    case "ArrowLeft":
      return move(
        state,
        collapse && !word ? from : word ? wordLeft(text, cursor) : cursor - 1,
        shift,
      );
    case "ArrowRight":
      return move(
        state,
        collapse && !word ? to : word ? wordRight(text, cursor) : cursor + 1,
        shift,
      );
    case "ArrowUp":
      return moveVertically(state, -1, shift);
    case "ArrowDown":
      return moveVertically(state, +1, shift);
    case "Home":
      return move(state, ctrl ? 0 : lineStart(text, cursor), shift);
    case "End":
      return move(state, ctrl ? text.length : lineEnd(text, cursor), shift);
    case "PageUp":
      return move(state, 0, shift);
    case "PageDown":
      return move(state, text.length, shift);
  }
  return null;
}

function applyEdition(state: EditorState, { key, ctrl, alt }: KeyStroke): EditorState | null {
  const { text, cursor } = state;
  const [from, to] = getSelection(state);
  switch (key) {
    case "Backspace":
      if (from !== to) return replace(state, from, to, []);
      return replace(state, ctrl ? wordLeft(text, cursor) : Math.max(0, cursor - 1), cursor, []);
    case "Delete":
      if (from !== to) return replace(state, from, to, []);
      return replace(
        state,
        cursor,
        ctrl ? wordRight(text, cursor) : Math.min(text.length, cursor + 1),
        [],
      );
    case "Enter":
      return type(state, "\n");
  }
  if (key.length === 1 && !ctrl && !alt) return type(state, key);
  // AltGr is reported as Ctrl+Alt on Windows (for instance "@" or "{").
  if (key.length === 1 && ctrl && alt) return type(state, key);
  return null;
}

function move(
  state: EditorState,
  target: number,
  shift: boolean,
  goalColumn: number | null = null,
): EditorState {
  const cursor = clamp(target, 0, state.text.length);
  return { ...state, cursor, anchor: shift ? state.anchor : cursor, goalColumn, pendingBold: null };
}

function moveVertically(state: EditorState, direction: -1 | 1, shift: boolean): EditorState {
  const { text, cursor } = state;
  const start = lineStart(text, cursor);
  const column = state.goalColumn ?? cursor - start;
  if (direction < 0) {
    if (start === 0) return move(state, 0, shift, column);
    const previousStart = lineStart(text, start - 1);
    return move(state, Math.min(previousStart + column, start - 1), shift, column);
  }
  const end = lineEnd(text, cursor);
  if (end === text.length) return move(state, text.length, shift, column);
  const nextStart = end + 1;
  return move(state, Math.min(nextStart + column, lineEnd(text, nextStart)), shift, column);
}

function type(state: EditorState, char: string): EditorState {
  const [from, to] = getSelection(state);
  const bold = state.pendingBold ?? guessBold(state.text, from, to);
  return replace(state, from, to, [{ char, bold }]);
}

/** Typed characters inherit the boldness of their neighbours. */
function guessBold(text: RichText, from: number, to: number): boolean {
  if (from !== to) return text[from].bold;
  const previous = text[from - 1];
  if (previous && previous.char !== "\n") return previous.bold;
  const next = text[from];
  if (next && next.char !== "\n") return next.bold;
  return false;
}

function toggleBold(state: EditorState): EditorState {
  const [from, to] = getSelection(state);
  if (from === to) {
    const current = state.pendingBold ?? guessBold(state.text, from, to);
    return { ...state, pendingBold: !current };
  }
  const selection = state.text.slice(from, to);
  const allBold = selection.every(({ char, bold }) => bold || isSpace(char));
  const text = [
    ...state.text.slice(0, from),
    ...selection.map(({ char }) => ({ char, bold: !allBold })),
    ...state.text.slice(to),
  ];
  return { ...pushHistory(state), text };
}

function copy(state: EditorState): EditorState {
  const [from, to] = getSelection(state);
  if (from === to) return state;
  return { ...state, clipboard: state.text.slice(from, to) };
}

function cut(state: EditorState): EditorState {
  const [from, to] = getSelection(state);
  if (from === to) return state;
  return replace(copy(state), from, to, []);
}

function paste(state: EditorState): EditorState {
  if (state.clipboard.length === 0) return state;
  const [from, to] = getSelection(state);
  return replace(state, from, to, state.clipboard);
}

function undo(state: EditorState): EditorState {
  const previous = state.undo[state.undo.length - 1];
  if (!previous) return state;
  return {
    ...state,
    ...previous,
    undo: state.undo.slice(0, -1),
    redo: [...state.redo, snapshot(state)],
    goalColumn: null,
    pendingBold: null,
  };
}

function redo(state: EditorState): EditorState {
  const next = state.redo[state.redo.length - 1];
  if (!next) return state;
  return {
    ...state,
    ...next,
    undo: [...state.undo, snapshot(state)],
    redo: state.redo.slice(0, -1),
    goalColumn: null,
    pendingBold: null,
  };
}

function replace(state: EditorState, from: number, to: number, insert: RichText): EditorState {
  if (from === to && insert.length === 0) return state;
  const cursor = from + insert.length;
  return {
    ...pushHistory(state),
    text: [...state.text.slice(0, from), ...insert, ...state.text.slice(to)],
    cursor,
    anchor: cursor,
    goalColumn: null,
    pendingBold: null,
  };
}

function pushHistory(state: EditorState): EditorState {
  return { ...state, undo: [...state.undo, snapshot(state)].slice(-HISTORY), redo: [] };
}

function snapshot({ text, cursor, anchor }: Snapshot): Snapshot {
  return { text, cursor, anchor };
}

export function lineStart(text: RichText, position: number): number {
  let pos = position;
  while (pos > 0 && text[pos - 1].char !== "\n") pos--;
  return pos;
}

export function lineEnd(text: RichText, position: number): number {
  let pos = position;
  while (pos < text.length && text[pos].char !== "\n") pos++;
  return pos;
}

type CharClass = "word" | "space" | "newline" | "punctuation";

function classify(char: string): CharClass {
  if (char === "\n") return "newline";
  if (isSpace(char)) return "space";
  if (/[\p{L}\p{N}_]/u.test(char)) return "word";
  return "punctuation";
}

/** Like in word processors: go to the start of the next word. */
export function wordRight(text: RichText, position: number): number {
  let pos = position;
  if (pos >= text.length) return text.length;
  const kind = classify(text[pos].char);
  if (kind === "newline") return pos + 1;
  while (pos < text.length && classify(text[pos].char) === kind) pos++;
  while (pos < text.length && classify(text[pos].char) === "space") pos++;
  return pos;
}

/** Like in word processors: go to the start of the current or previous word. */
export function wordLeft(text: RichText, position: number): number {
  let pos = position;
  while (pos > 0 && classify(text[pos - 1].char) === "space") pos--;
  if (pos === 0) return 0;
  const kind = classify(text[pos - 1].char);
  if (kind === "newline") return pos < position ? pos : pos - 1;
  while (pos > 0 && classify(text[pos - 1].char) === kind) pos--;
  return pos;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
