/**
 * Selection model of a Windows-like file explorer.
 *
 * The selection is a bit mask: bit `i` is set if the file at index `i` is selected.
 * The anchor is the file from which a `Shift`-click selects a range.
 */
export interface ExplorerState {
  mask: number;
  anchor: number | null;
}

export interface Click {
  /** Index of the clicked file, or `null` for a click in the empty area of the list. */
  file: number | null;
  ctrl: boolean;
  shift: boolean;
}

export function click(file: number): Click {
  return { file, ctrl: false, shift: false };
}

export function ctrlClick(file: number): Click {
  return { file, ctrl: true, shift: false };
}

export function shiftClick(file: number): Click {
  return { file, ctrl: false, shift: true };
}

export function ctrlShiftClick(file: number): Click {
  return { file, ctrl: true, shift: true };
}

export function emptyClick(): Click {
  return { file: null, ctrl: false, shift: false };
}

/** @returns The mask of the files whose indexes are in `files`. */
export function maskOf(files: number[]): number {
  return files.reduce((mask, file) => mask | bit(file), 0);
}

export function isSelected(mask: number, file: number): boolean {
  return (mask & bit(file)) !== 0;
}

/**
 * Apply a click as Windows Explorer does:
 * - click: select only this file, which becomes the anchor;
 * - `Ctrl`-click: toggle this file, which becomes the anchor;
 * - `Shift`-click: select only the files from the anchor to this one;
 * - `Ctrl`+`Shift`-click: add the files from the anchor to this one;
 * - click in the empty area: deselect everything (but not with `Ctrl`).
 * Without anchor, `Shift` is ignored.
 */
export function applyClick(state: ExplorerState, { file, ctrl, shift }: Click): ExplorerState {
  if (file === null) return ctrl ? state : { mask: 0, anchor: null };

  const { mask, anchor } = state;
  if (shift && anchor !== null) {
    const range = rangeMask(anchor, file);
    return { mask: ctrl ? mask | range : range, anchor };
  }
  if (ctrl) return { mask: mask ^ bit(file), anchor: file };
  return { mask: bit(file), anchor: file };
}

function bit(file: number): number {
  return 1 << file;
}

function rangeMask(a: number, b: number): number {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return ((1 << (max + 1)) - 1) & ~((1 << min) - 1);
}
