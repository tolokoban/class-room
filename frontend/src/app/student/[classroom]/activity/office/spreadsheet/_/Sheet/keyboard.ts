import type React from "react";

import { type SheetController } from "./hooks";

const ARROWS: Record<string, [dRow: number, dCol: number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

/** Keys pressed while the grid has the focus (no cell being edited in place). */
export function handleGridKey(evt: React.KeyboardEvent, sheet: SheetController) {
  // Keys typed in the in-cell editor bubble up to the grid.
  if (evt.target !== evt.currentTarget) return;

  const ctrl = evt.ctrlKey || evt.metaKey;
  const shift = evt.shiftKey;
  const arrow = ARROWS[evt.key];
  if (arrow) {
    evt.preventDefault();
    if (ctrl) sheet.jump(...arrow, shift);
    else sheet.move(...arrow, shift);
    return;
  }
  const action = gridAction(evt.key, ctrl, shift, sheet);
  if (action) {
    evt.preventDefault();
    action();
  }
}

function gridAction(
  key: string,
  ctrl: boolean,
  shift: boolean,
  sheet: SheetController,
): (() => void) | undefined {
  switch (key) {
    case "Enter":
      return () => sheet.move(shift ? -1 : 1, 0, false);
    case "Tab":
      return () => sheet.move(0, shift ? -1 : 1, false);
    case "Home":
      return () => sheet.select({ col: 0, row: ctrl ? 0 : sheet.anchor.row });
    case "F2":
      return () => sheet.editActive(null, true);
    case "Delete":
      return () => sheet.clearSelection();
    case "Backspace":
      return () => sheet.editActive("", true);
  }
  if (ctrl && key.toLowerCase() === "a") return () => sheet.selectAll();
  // Typing a character replaces the content of the active cell.
  if (!ctrl && key.length === 1 && !sheet.readOnly) return () => sheet.editActive(key, true);

  return undefined;
}

/** Keys pressed in the in-cell editor or in the formula bar. */
export function handleEditorKey(
  evt: React.KeyboardEvent<HTMLInputElement>,
  sheet: SheetController,
) {
  const shift = evt.shiftKey;
  const arrow = ARROWS[evt.key];
  if (evt.key === "Enter") {
    evt.preventDefault();
    sheet.commitAndMove(shift ? -1 : 1, 0);
  } else if (evt.key === "Tab") {
    evt.preventDefault();
    sheet.commitAndMove(0, shift ? -1 : 1);
  } else if (evt.key === "Escape") {
    evt.preventDefault();
    sheet.cancelEdit();
  } else if (arrow && sheet.edit?.enterMode && !sheet.edit.text.startsWith("=")) {
    // When the edition started by typing, arrows validate (except in formulas).
    evt.preventDefault();
    sheet.commitAndMove(...arrow);
  }
}

/**
 * Leaving an editor validates it, unless the focus goes to the other editor
 * (from the cell to the formula bar, for instance).
 */
export function handleEditorBlur(evt: React.FocusEvent<HTMLInputElement>, sheet: SheetController) {
  const next = evt.relatedTarget;
  const sameSheet = evt.currentTarget.closest("[data-sheet]");
  if (next instanceof HTMLInputElement && sameSheet && next.closest("[data-sheet]") === sameSheet) {
    return;
  }

  sheet.commit();
}
