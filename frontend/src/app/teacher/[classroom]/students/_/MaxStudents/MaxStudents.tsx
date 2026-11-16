import { IconOk, Theme, ViewButton, ViewInputNumber } from "@tolokoban/ui";

import { useMaxStudents } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./MaxStudents.module.css";

const $ = Theme.classNames;

export interface MaxStudentsProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

/**
 * Edit the maximum number of students that can join a class room at the same time.
 */
export function MaxStudents({ className, classroom }: MaxStudentsProps) {
  const tr = useTranslation();
  const max = useMaxStudents(classroom);

  if (!max.isReady) return null;

  return (
    <div className={$.join(className, Styles.maxStudents)}>
      <ViewInputNumber
        label={tr.label}
        min={1}
        max={1000}
        value={max.maxStudents}
        onChange={max.setMaxStudents}
        onEnterKeyPressed={max.save}
      />
      <ViewButton icon={IconOk} enabled={max.isModified} waiting={max.isPending} onClick={max.save}>
        {tr.save}
      </ViewButton>
    </div>
  );
}
