import { Theme } from "@tolokoban/ui";

import { toLocal } from "../../Sheet/engine/content";
import { useSheetLocale } from "../../Sheet";

import Styles from "./FormulaList.module.css";

const $ = Theme.classNames;

export interface CellFormula {
  /** Cell reference, like `"A2"`. */
  key: string;
  /** Formula of the student, in canonical form. */
  formula: string;
}

export interface FormulaListProps {
  className?: string;
  /** Message displayed above the list. */
  message: string;
  formulas: CellFormula[];
}

/** A message followed by the list of the student's formulas it is about. */
export function FormulaList({ className, message, formulas }: FormulaListProps) {
  const locale = useSheetLocale();
  return (
    <div className={$.join(className, Styles.formulaList)}>
      <p>{message}</p>
      <ul>
        {formulas.map(({ key, formula }) => (
          <li key={key}>
            <b>{key}</b>: <code>{toLocal(formula, locale)}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
