import React from "react";

import { Notif } from "@/components/Notification";
import {
  type CellPos,
  type Cells,
  cellKey,
  clampToGrid,
  COLUMNS,
  type Rect,
  rectCells,
  rectOf,
  ROWS,
} from "./engine/address";
import { type ClipboardData, copyCells, parseClipboardText, pasteCells } from "./engine/clipboard";
import { toCanonical, toLocal } from "./engine/content";
import { evaluateSheet } from "./engine/evaluate";
import { fill } from "./engine/fill";
import { type Locale } from "./engine/locale";
import { useTranslation } from "./translation";

export interface Edit {
  /** Key of the edited cell. */
  key: string;
  text: string;
  /** Edited directly in the cell (not in the formula bar). */
  inCell: boolean;
  /** Edition started by typing: arrow keys validate and move to another cell. */
  enterMode: boolean;
}

export interface SheetHookProps {
  cells: Cells;
  onChange?(cells: Cells): void;
  readOnly?: boolean;
  /** Copy the computed values of the cells instead of their formulas. */
  copyValuesOnly?: boolean;
  /** Copy is forbidden: an error notification is displayed instead. */
  noCopy?: boolean;
}

/** Last cells copied from any sheet, to shift the formulas when they are pasted. */
let lastCopy: ClipboardData | null = null;

export type SheetController = ReturnType<typeof useSheet>;

export function useSheet({
  cells,
  onChange,
  readOnly = false,
  copyValuesOnly = false,
  noCopy = false,
}: SheetHookProps) {
  const tr = useTranslation();
  const locale = useSheetLocale();
  const values = React.useMemo(() => evaluateSheet(cells, locale), [cells, locale]);
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const cellsRef = React.useRef(cells);
  cellsRef.current = cells;
  const selection = useSelection();
  const editing = useEditing(locale, readOnly, (key, raw) => {
    const next = { ...cellsRef.current };
    if (raw === "") delete next[key];
    else next[key] = raw;
    onChange?.(next);
  });
  const focusGrid = () => gridRef.current?.focus({ preventScroll: true });
  const activeKey = cellKey(selection.anchor);
  const activeRaw = cells[activeKey] ?? "";
  return {
    ...selection,
    ...editing,
    cells,
    locale,
    values,
    readOnly,
    gridRef,
    focusGrid,
    activeKey,
    /** What the formula bar displays. */
    activeText: editing.edit?.text ?? toLocal(activeRaw, locale),
    /** Start editing the active cell, with `text` or with its current content. */
    editActive(text: string | null, inCell: boolean) {
      if (readOnly) return;

      const enterMode = text !== null;
      editing.startEdit({
        key: activeKey,
        text: text ?? toLocal(activeRaw, locale),
        inCell,
        enterMode,
      });
    },
    commitAndMove(dRow: number, dCol: number) {
      editing.commit();
      selection.move(dRow, dCol, false);
      focusGrid();
    },
    cancelEdit() {
      editing.cancel();
      focusGrid();
    },
    clearSelection() {
      if (readOnly) return;

      const next = { ...cellsRef.current };
      for (const pos of rectCells(selection.rect)) delete next[cellKey(pos)];
      onChange?.(next);
    },
    /** Put the selection in the system clipboard. */
    copyToClipboard() {
      if (noCopy) {
        Notif.error(tr.copyForbidden);
        return;
      }

      lastCopy = copyCells(cells, values, selection.rect, locale, copyValuesOnly);
      navigator.clipboard.writeText(lastCopy.text).catch(console.error);
    },
    /**
     * Paste `text` (coming from the system clipboard) on the selection.
     * If `text` is `null`, the last cells copied in this application are pasted.
     */
    paste(text: string | null) {
      if (readOnly) return;

      const data =
        text === null || (lastCopy && normalize(lastCopy.text) === normalize(text))
          ? lastCopy
          : parseClipboardText(text, locale);
      if (!data) return;

      editing.cancel();
      const { rect } = selection;
      const result = pasteCells(cellsRef.current, data, { col: rect.left, row: rect.top });
      onChange?.(result.cells);
      selection.select(
        { col: result.rect.left, row: result.rect.top },
        { col: result.rect.right, row: result.rect.bottom },
      );
    },
    applyFill(source: Rect, target: Rect) {
      if (readOnly) return;

      onChange?.(fill(cellsRef.current, source, target));
      selection.select(
        { col: target.left, row: target.top },
        { col: target.right, row: target.bottom },
      );
    },
  };
}

/** Other applications can change the line endings. */
function normalize(text: string): string {
  return text.replace(/\r\n?/g, "\n").replace(/\n$/, "");
}

function useSelection() {
  /** The active cell. */
  const [anchor, setAnchor] = React.useState<CellPos>({ col: 0, row: 0 });
  /** The other corner of the selected rectangle. */
  const [focus, setFocus] = React.useState<CellPos>({ col: 0, row: 0 });
  const select = (a: CellPos, b: CellPos = a) => {
    setAnchor(clampToGrid(a));
    setFocus(clampToGrid(b));
  };
  return {
    anchor,
    focus,
    rect: rectOf(anchor, focus),
    select,
    /** Move the selection to another rectangle corner. */
    extendTo(pos: CellPos) {
      setFocus(clampToGrid(pos));
    },
    /** Move the active cell, or extend the selection. */
    move(dRow: number, dCol: number, extend: boolean) {
      if (extend) setFocus(clampToGrid({ col: focus.col + dCol, row: focus.row + dRow }));
      else select({ col: anchor.col + dCol, row: anchor.row + dRow });
    },
    /** Move to the edge of the sheet (Ctrl + arrow). */
    jump(dRow: number, dCol: number, extend: boolean) {
      const from = extend ? focus : anchor;
      const pos = {
        col: dCol === 0 ? from.col : dCol < 0 ? 0 : COLUMNS - 1,
        row: dRow === 0 ? from.row : dRow < 0 ? 0 : ROWS - 1,
      };
      if (extend) setFocus(pos);
      else select(pos);
    },
    selectAll() {
      select({ col: 0, row: 0 }, { col: COLUMNS - 1, row: ROWS - 1 });
    },
  };
}

function useEditing(locale: Locale, readOnly: boolean, save: (key: string, raw: string) => void) {
  const [edit, setEditState] = React.useState<Edit | null>(null);
  /** Synchronous copy of `edit`, because "blur" events can come before a new render. */
  const editRef = React.useRef<Edit | null>(null);
  const setEdit = (value: Edit | null) => {
    editRef.current = value;
    setEditState(value);
  };
  return {
    edit,
    startEdit(value: Edit) {
      if (!readOnly) setEdit(value);
    },
    setEditText(text: string) {
      const current = editRef.current;
      if (current) setEdit({ ...current, text });
    },
    /** Save the edited cell, if any. */
    commit() {
      const current = editRef.current;
      if (!current) return;

      setEdit(null);
      save(current.key, toCanonical(current.text, locale));
    },
    cancel() {
      setEdit(null);
    },
  };
}

/** Locale of the sheets, in the language of the user. */
export function useSheetLocale(): Locale {
  const tr = useTranslation();
  return React.useMemo(
    () => ({
      decimal: tr.decimalSeparator === "," ? "," : ".",
      separator: tr.argumentSeparator === ";" ? ";" : ",",
      functions: {
        SUM: tr.fnSum,
        COUNT: tr.fnCount,
        COUNTA: tr.fnCountA,
        AVERAGE: tr.fnAverage,
        IF: tr.fnIf,
        AND: tr.fnAnd,
        OR: tr.fnOr,
        NOT: tr.fnNot,
      },
      errors: {
        DIV0: tr.errDiv0,
        NAME: tr.errName,
        REF: tr.errRef,
        VALUE: tr.errValue,
        CIRC: tr.errCirc,
        SYNTAX: tr.errSyntax,
      },
      booleans: { TRUE: tr.true, FALSE: tr.false },
    }),
    [tr],
  );
}
