import { IconAdd, Theme, ViewButton, ViewCombo } from "@tolokoban/ui";

import { useAssignWritten } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./AssignWritten.module.css";

const $ = Theme.classNames;

export interface AssignWrittenProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** IDs of the written productions already assigned to the class room. */
  assigned: number[];
}

/**
 * Assign one of the written productions of the teacher to a class room.
 */
export function AssignWritten({ className, classroom, assigned }: AssignWrittenProps) {
  const tr = useTranslation();
  const assign = useAssignWritten(classroom, assigned);

  if (assign.isLoading) return null;

  return (
    <div className={$.join(className, Styles.assignWritten)}>
      {assign.options.length === 0 ? (
        <em>{tr.none}</em>
      ) : (
        <>
          <ViewCombo label={tr.label} value={assign.value} onChange={assign.setValue}>
            {assign.options.map((item) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </ViewCombo>
          <ViewButton icon={IconAdd} waiting={assign.isPending} onClick={assign.assign}>
            {tr.assign}
          </ViewButton>
        </>
      )}
    </div>
  );
}
