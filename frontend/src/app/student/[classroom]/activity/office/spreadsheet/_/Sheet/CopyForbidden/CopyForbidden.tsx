import { Theme, ViewDialog } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./CopyForbidden.module.css";

const $ = Theme.classNames;

export interface CopyForbiddenProps {
  className?: string;
  onClose(): void;
}

/** Modal shown when the student tries to copy a sheet whose copy is forbidden. */
export function CopyForbidden({ className, onClose }: CopyForbiddenProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.copyForbidden)}
      buttonValidate={{ children: tr.understood, onClick: onClose }}
    >
      <p>{tr.message}</p>
      <p>{tr.hint}</p>
    </ViewDialog>
  );
}
