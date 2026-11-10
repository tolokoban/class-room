import { Theme } from "@tolokoban/ui";

import { rectContains } from "../engine/address";
import { type SheetController } from "../hooks";
import { handleGridKey } from "../keyboard";
import { areaStyle } from "./area";
import { CellEditor } from "./CellEditor";
import { Headers } from "./Headers";
import { useGrid } from "./hooks";
import { SelectionBox } from "./SelectionBox";

import Styles from "./Grid.module.css";

const $ = Theme.classNames;

export interface GridProps {
  className?: string;
  sheet: SheetController;
  /** Mark the cells containing a formula with a "Fx" watermark. */
  formulaHints?: boolean;
}

export function Grid({ className, sheet, formulaHints = false }: GridProps) {
  const grid = useGrid(sheet);
  const { anchor, rect, edit } = sheet;
  return (
    <div
      ref={sheet.gridRef}
      className={$.join(className, Styles.grid)}
      tabIndex={0}
      onKeyDown={(evt) => handleGridKey(evt, sheet)}
      onPointerDown={grid.handlePointerDown}
      onDoubleClick={grid.handleDoubleClick}
    >
      <div>
        <Headers selection={rect} />
        {grid.cells.map(({ key, pos, text, kind, formula }) => (
          <div
            key={key}
            data-col={pos.col}
            data-row={pos.row}
            data-kind={kind}
            data-formula={formulaHints && formula}
            data-selected={rectContains(rect, pos) && key !== sheet.activeKey}
            style={areaStyle({ top: pos.row, left: pos.col, bottom: pos.row, right: pos.col })}
          >
            {text}
          </div>
        ))}
        <SelectionBox
          rect={rect}
          onFillHandlePointerDown={sheet.readOnly || edit ? undefined : grid.handleFillPointerDown}
        />
        {grid.fillTarget && (
          <div className={Styles.fillPreview} style={areaStyle(grid.fillTarget)} />
        )}
        {edit?.inCell && <CellEditor sheet={sheet} pos={anchor} />}
      </div>
    </div>
  );
}
