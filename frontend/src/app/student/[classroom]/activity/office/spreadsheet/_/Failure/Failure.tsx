import { Theme, ViewDialog } from "@tolokoban/ui";

import { type Notion, NotionList } from "../NotionList";
import { useTranslation } from "./translation";

import Styles from "./Failure.module.css";

const $ = Theme.classNames;

export interface FailureProps {
  className?: string;
  /** Number of wrong formulas in the student's sheet. */
  wrongCount: number;
  /** Notions needed to solve the exercise. */
  notions?: Notion[];
  onClose(): void;
}

/** Modal shown when some formulas of the student's sheet are wrong. */
export function Failure({ className, wrongCount, notions, onClose }: FailureProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.failure)}
      title={tr.title}
      buttonValidate={{ children: tr.ok, onClick: onClose }}
    >
      <p>{wrongCount === 1 ? tr.wrongOne : tr.wrongMany$(`${wrongCount}`)}</p>
      <NotionList notions={notions} />
    </ViewDialog>
  );
}
