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
}

/**
 * Simplified spreadsheet (5 columns, 30 rows) with a formula bar,
 * keyboard and mouse selection, and a fill handle.
 */
export function Sheet({ className, cells, onChange, readOnly, formulaHints }: SheetProps) {
  const sheet = useSheet({ cells, onChange, readOnly });
  return (
    <div className={$.join(className, Styles.sheet)} data-sheet>
      <FormulaBar sheet={sheet} />
      <Grid sheet={sheet} formulaHints={formulaHints} />
    </div>
  );
}
