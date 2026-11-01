import { IconRefresh, Theme, ViewFloatingButton, ViewSpinner } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./StudentsList.module.css";

const $ = Theme.classNames;

export interface StudentsListProps {
  className?: string;
  students: { nickname: string; count: number }[];
  isLoading: boolean;
  /** Display the number of answers of each student. */
  showCount: boolean;
  onRefresh(this: void): void;
}

export function StudentsList({
  className,
  students,
  isLoading,
  showCount,
  onRefresh,
}: StudentsListProps) {
  const tr = useTranslation();

  return (
    <div className={$.join(className, Styles.studentsList)}>
      <header>
        <strong>{tr.students}</strong>
        <ViewFloatingButton icon={IconRefresh} size="S" enabled={!isLoading} onClick={onRefresh} />
      </header>
      {isLoading && <ViewSpinner />}
      {!isLoading && students.length === 0 && <p>{tr.noStudent}</p>}
      <ul>
        {students.map(({ nickname, count }) => (
          <li key={nickname}>
            <span>{nickname}</span>
            {showCount && <span>{tr.answers$(String(count))}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
