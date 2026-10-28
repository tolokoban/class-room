import { Theme, ViewDialog } from "@tolokoban/ui";

import { useTeacherOnly } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./TeacherOnly.module.css";

const $ = Theme.classNames;

export interface TeacherOnlyProps {
  className?: string;
}

/**
 * Displayed instead of the page when the current user is not a teacher.
 */
export function TeacherOnly({ className }: TeacherOnlyProps) {
  const tr = useTranslation();
  const { isPending, backHome } = useTeacherOnly();

  return (
    <div className={$.join(className, Styles.teacherOnly)}>
      <ViewDialog
        headColor="error"
        title={tr.title}
        buttonValidate={{ children: tr.backHome, waiting: isPending, onClick: backHome }}
      >
        <p>{tr.message}</p>
      </ViewDialog>
    </div>
  );
}
