import { Theme, ViewButton, ViewDialog } from "@tolokoban/ui";

import { StudentsList } from "./StudentsList";
import { useClearResults, useQuizMenu, useStudentsAnswers } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./QuizMenu.module.css";

const $ = Theme.classNames;

export interface QuizMenuProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Code of the activity, like `"AI/usage"`. */
  activity: string;
  title: string;
  onClose(this: void): void;
}

export function QuizMenu({ className, classroom, activity, title, onClose }: QuizMenuProps) {
  const tr = useTranslation();
  const menu = useQuizMenu(classroom, activity, onClose);
  const { isLoading, students, hasAnswers, refresh } = useStudentsAnswers(classroom, activity);
  const handleClear = useClearResults(classroom, activity);

  return (
    <ViewDialog className={$.join(className, Styles.quizMenu)} title={title}>
      <div className={Styles.content}>
        <ViewButton variant="text" color="secondary-5" onClick={menu.results}>
          {tr.results}
        </ViewButton>
        {menu.canSelect && (
          <ViewButton color="secondary-5" waiting={menu.isPending} onClick={menu.select}>
            {tr.select}
          </ViewButton>
        )}
        <StudentsList
          className={Styles.students}
          students={students}
          isLoading={isLoading}
          showCount={menu.isCurrent}
          onRefresh={refresh}
        />
        {hasAnswers && (
          <ViewButton color="error" onClick={handleClear}>
            {tr.clear}
          </ViewButton>
        )}
      </div>
    </ViewDialog>
  );
}
