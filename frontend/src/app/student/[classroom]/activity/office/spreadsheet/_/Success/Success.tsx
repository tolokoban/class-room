import { Theme, ViewDialog } from "@tolokoban/ui";

import { type Notion, NotionList } from "../NotionList";
import { type CellFormula, FormulaList } from "./FormulaList";
import { useTranslation } from "./translation";

import Styles from "./Success.module.css";

const $ = Theme.classNames;

export type { CellFormula } from "./FormulaList";

export interface SuccessProps {
  className?: string;
  /** Formulas of the student that are longer than the expected ones. */
  longFormulas: CellFormula[];
  /** Some formulas of the student should use `$` in their references. */
  noDollar: boolean;
  /** Notions needed to solve the exercise, listed after a partial success. */
  notions?: Notion[];
  onContinue(): void;
  onRestart(): void;
}

/** Modal shown when the student's sheet matches the expected one. */
export function Success({
  className,
  longFormulas,
  noDollar,
  notions,
  onContinue,
  onRestart,
}: SuccessProps) {
  const tr = useTranslation();
  const tooLong = longFormulas.length > 0;
  const partial = tooLong || noDollar;
  return (
    <ViewDialog
      className={$.join(className, Styles.success)}
      title={tr.title}
      buttonCancel={partial ? { children: tr.restart, onClick: onRestart } : undefined}
      buttonValidate={{ children: tr.continue, onClick: onContinue }}
    >
      {!partial && <p>{tr.message}</p>}
      {noDollar && <p>{tr.noDollar}</p>}
      {tooLong && <FormulaList message={tr.tooLong} formulas={longFormulas} />}
      {partial && <NotionList notions={notions} />}
    </ViewDialog>
  );
}
