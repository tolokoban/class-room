import React from "react";

import {
  type CellPos,
  type Cells,
  cellKey,
  COLUMNS,
  type Rect,
  rectContains,
  ROWS,
} from "../engine/address";
import { formatValue } from "../engine/content";
import { type CellValue, FormulaError } from "../engine/evaluate";
import { computeFillTarget } from "../engine/fill";
import { type SheetController } from "../hooks";
import { useTranslation } from "../translation";
import { type ContextMenuItem } from "./ContextMenu";

export interface GridCell {
  key: string;
  pos: CellPos;
  text: string;
  kind: "empty" | "number" | "text" | "boolean" | "error";
  /** The cell contains a formula. */
  formula: boolean;
}

/** Distance (in pixels) to the border of the grid that triggers scrolling when dragging. */
const AUTO_SCROLL_MARGIN = 24;
const AUTO_SCROLL_STEP = 12;

export function useGrid(sheet: SheetController) {
  const { cells: raws, values, locale, gridRef } = sheet;
  const [fillTarget, setFillTarget] = React.useState<Rect | null>(null);
  const menu = useContextMenu(sheet);
  useClipboardEvents(sheet);
  const cells = React.useMemo(
    () => buildCells(raws, values, (value) => formatValue(value, locale)),
    [raws, values, locale],
  );
  useScrollIntoView(gridRef, sheet.focus);
  const startDrag = (onMove: (pos: CellPos) => void, onEnd?: () => void) => {
    const move = (evt: PointerEvent) => {
      autoScroll(gridRef.current, evt);
      const pos = cellAt(gridRef.current, evt.clientX, evt.clientY);
      if (pos) onMove(pos);
    };
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      onEnd?.();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };
  return {
    cells,
    fillTarget,
    menu,
    handlePointerDown(evt: React.PointerEvent) {
      if (evt.button !== 0) return;

      const header = headerAt(evt.target);
      const pos = header ? header[0] : posOf(evt.target);
      if (!pos) return;

      sheet.commit();
      if (header) sheet.select(...header);
      else if (evt.shiftKey) sheet.extendTo(pos);
      else sheet.select(pos);
      sheet.focusGrid();
      if (!header) startDrag(sheet.extendTo);
    },
    handleDoubleClick(evt: React.MouseEvent) {
      if (posOf(evt.target)) sheet.editActive(null, true);
    },
    handleFillPointerDown(evt: React.PointerEvent) {
      if (evt.button !== 0) return;

      evt.stopPropagation();
      evt.preventDefault();
      const source = sheet.rect;
      let target: Rect | null = null;
      startDrag(
        (pos) => {
          target = computeFillTarget(source, pos);
          setFillTarget(target);
        },
        () => {
          if (target) sheet.applyFill(source, target);
          setFillTarget(null);
        },
      );
    },
  };
}

/**
 * Ctrl+V (Cmd+V on macOS). Ctrl+C is handled in `keyboard.ts`, because some browsers
 * (Safari) do not fire a "copy" event when no text is selected.
 * Without text selection, the browser sends the "paste" event to the body,
 * not to the focused grid: we listen to the whole document and act only if the grid has the focus.
 * In the in-cell editor, the default behaviour is kept (the editor is the active element).
 */
function useClipboardEvents(sheet: SheetController) {
  const sheetRef = React.useRef(sheet);
  sheetRef.current = sheet;
  React.useEffect(() => {
    const isFocused = () => {
      const grid = sheetRef.current.gridRef.current;
      return !!grid && document.activeElement === grid;
    };
    const handlePaste = (evt: ClipboardEvent) => {
      if (!isFocused() || !evt.clipboardData) return;

      evt.preventDefault();
      sheetRef.current.paste(evt.clipboardData.getData("text/plain"));
    };
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);
}

export interface GridMenu {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

/** Right click: "Copy" (and "Paste" if the sheet can be modified). */
function useContextMenu(sheet: SheetController) {
  const tr = useTranslation();
  const [menu, setMenu] = React.useState<GridMenu | null>(null);
  const copy = () => {
    sheet.copyToClipboard();
    sheet.focusGrid();
  };
  const paste = () => {
    navigator.clipboard
      .readText()
      .then(sheet.paste)
      // Reading the clipboard can be forbidden by the browser.
      .catch(() => sheet.paste(null))
      .finally(sheet.focusGrid);
  };
  return {
    value: menu,
    handleClose: () => setMenu(null),
    handleContextMenu(evt: React.MouseEvent) {
      evt.preventDefault();
      const pos = posOf(evt.target);
      if (!pos) return;

      sheet.commit();
      if (!rectContains(sheet.rect, pos)) sheet.select(pos);
      const items = [{ label: tr.copy, onClick: copy }];
      if (!sheet.readOnly) items.push({ label: tr.paste, onClick: paste });
      setMenu({ x: evt.clientX, y: evt.clientY, items });
    },
  };
}

function buildCells(
  raws: Cells,
  values: Record<string, CellValue>,
  format: (value: CellValue) => string,
) {
  const cells: GridCell[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const pos = { col, row };
      const key = cellKey(pos);
      const value = values[key] ?? null;
      const formula = raws[key]?.startsWith("=") ?? false;
      cells.push({ key, pos, text: format(value), kind: kindOf(value), formula });
    }
  }
  return cells;
}

function kindOf(value: CellValue): GridCell["kind"] {
  if (value === null) return "empty";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof FormulaError) return "error";
  return "text";
}

/** Keep the moving corner of the selection visible. */
function useScrollIntoView(gridRef: React.RefObject<HTMLDivElement | null>, { col, row }: CellPos) {
  React.useEffect(() => {
    const cell = gridRef.current?.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [gridRef, col, row]);
}

function posOf(target: EventTarget | null): CellPos | null {
  if (!(target instanceof Element)) return null;

  const cell = target.closest<HTMLElement>("[data-row]");
  if (!cell) return null;

  return { col: Number(cell.dataset.col), row: Number(cell.dataset.row) };
}

/** Clicking a header selects a whole column or row. */
function headerAt(target: EventTarget | null): [CellPos, CellPos] | null {
  if (!(target instanceof Element)) return null;

  const header = target.closest<HTMLElement>("[data-header-col], [data-header-row]");
  if (!header) return null;

  const { headerCol, headerRow } = header.dataset;
  if (headerCol !== undefined) {
    const col = Number(headerCol);
    return [
      { col, row: 0 },
      { col, row: ROWS - 1 },
    ];
  }
  const row = Number(headerRow);
  return [
    { col: 0, row },
    { col: COLUMNS - 1, row },
  ];
}

function cellAt(grid: HTMLElement | null, x: number, y: number): CellPos | null {
  const element = document.elementFromPoint(x, y);
  if (!grid || !element || !grid.contains(element)) return null;

  return posOf(element);
}

function autoScroll(grid: HTMLElement | null, { clientX, clientY }: PointerEvent) {
  if (!grid) return;

  const box = grid.getBoundingClientRect();
  if (clientY > box.bottom - AUTO_SCROLL_MARGIN) grid.scrollTop += AUTO_SCROLL_STEP;
  else if (clientY < box.top + AUTO_SCROLL_MARGIN) grid.scrollTop -= AUTO_SCROLL_STEP;
  if (clientX > box.right - AUTO_SCROLL_MARGIN) grid.scrollLeft += AUTO_SCROLL_STEP;
  else if (clientX < box.left + AUTO_SCROLL_MARGIN) grid.scrollLeft -= AUTO_SCROLL_STEP;
}
