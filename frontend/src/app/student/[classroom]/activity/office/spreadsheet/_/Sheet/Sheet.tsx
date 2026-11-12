import { Theme } from "@tolokoban/ui";

import { type Cells } from "./engine/address";
import { FormulaBar } from "./FormulaBar";
import { Grid } from "./Grid";
import { useSheet } from "./hooks";

import Styles from "./Sheet.module.css";

const $ = Theme.classNames;

export interface SheetProps {
  className?: string;
  /** Raw content of the cells, formulas being in canonical (english) form. */
  cells: Cells;
  onChange?(cells: Cells): void;
  /** The cells can be selected, but not modified. */
  readOnly?: boolean;
  /** Mark the cells containing a formula with a "Fx" watermark. */
  formulaHints?: boolean;
  /** Do not reveal the formulas in the formula bar (the student must guess them). */
  hideFormulas?: boolean;
  /** Copy the computed values of the cells instead of their formulas. */
  copyValuesOnly?: boolean;
  /** Copy is forbidden: an error notification is displayed instead. */
  noCopy?: boolean;
  /** Keys of the cells to highlight as wrong. */
  wrongCells?: string[];
}

/**
 * Simplified spreadsheet (5 columns, 30 rows) with a formula bar,
 * keyboard and mouse selection, a fill handle and copy/paste (keyboard or right click).
 */
export function Sheet({
  className,
  cells,
  onChange,
  readOnly,
  formulaHints,
  hideFormulas,
  copyValuesOnly,
  noCopy,
  wrongCells,
}: SheetProps) {
  const sheet = useSheet({ cells, onChange, readOnly, copyValuesOnly, noCopy });
  return (
    <div className={$.join(className, Styles.sheet)} data-sheet>
      <FormulaBar sheet={sheet} hideFormulas={hideFormulas} />
      <Grid sheet={sheet} formulaHints={formulaHints} wrongCells={wrongCells} />
    </div>
  );
}
