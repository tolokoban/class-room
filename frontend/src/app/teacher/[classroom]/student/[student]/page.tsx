import { IconArrowLeft, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { StudentWritten } from "./_/StudentWritten";
import { useStudentPage } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

/**
 * Results of one student for the written production that is the current activity of the class room.
 */
export default function Page() {
  const tr = useTranslation();
  const user = State.user.useValue();
  const page = useStudentPage();

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <nav>
        <ViewButton variant="text" icon={IconArrowLeft} onClick={page.backUrl}>
          {tr.back}
        </ViewButton>
      </nav>
      <h1>{page.student}</h1>
      {page.isLoading && <ViewSpinner />}
      {page.error && <div className={Styles.error}>{page.error.message}</div>}
      {!page.isLoading && !page.error && page.writtenId === null && <em>{tr.noWritten}</em>}
      {page.writtenId !== null && (
        <StudentWritten
          classroom={page.classroom}
          writtenId={page.writtenId}
          student={page.student}
        />
      )}
    </div>
  );
}
