import { Theme, ViewDialog } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Success.module.css";

const $ = Theme.classNames;

export interface SuccessProps {
  className?: string;
  onContinue(): void;
}

/** Modal shown when the student's sheet matches the expected one. */
export function Success({ className, onContinue }: SuccessProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.success)}
      title={tr.title}
      buttonValidate={{ children: tr.continue, onClick: onContinue }}
    >
      <p>{tr.message}</p>
    </ViewDialog>
  );
}
