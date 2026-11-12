import { Theme, ViewDialog } from "@tolokoban/ui";

import { toLocal } from "../Sheet/engine/content";
import { useSheetLocale } from "../Sheet";
import { useTranslation } from "./translation";

import Styles from "./Success.module.css";

const $ = Theme.classNames;

export interface LongFormula {
  /** Cell reference, like `"A2"`. */
  key: string;
  /** Formula of the student, in canonical form. */
  formula: string;
}

export interface SuccessProps {
  className?: string;
  /** Formulas of the student that are longer than the expected ones. */
  longFormulas: LongFormula[];
  onContinue(): void;
  onRestart(): void;
}

/** Modal shown when the student's sheet matches the expected one. */
export function Success({ className, longFormulas, onContinue, onRestart }: SuccessProps) {
  const tr = useTranslation();
  const locale = useSheetLocale();
  const tooLong = longFormulas.length > 0;
  return (
    <ViewDialog
      className={$.join(className, Styles.success)}
      title={tr.title}
      buttonCancel={tooLong ? { children: tr.restart, onClick: onRestart } : undefined}
      buttonValidate={{ children: tr.continue, onClick: onContinue }}
    >
      <p>{tooLong ? tr.tooLong : tr.message}</p>
      {tooLong && (
        <ul>
          {longFormulas.map(({ key, formula }) => (
            <li key={key}>
              <b>{key}</b>: <code>{toLocal(formula, locale)}</code>
            </li>
          ))}
        </ul>
      )}
    </ViewDialog>
  );
}
