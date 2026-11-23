import { Theme, ViewSpinner } from "@tolokoban/ui";

import { useStudentWritten } from "./hooks";
import { StudentUpload } from "./StudentUpload";
import { useTranslation } from "./translation";

import Styles from "./StudentWritten.module.css";

const $ = Theme.classNames;

export interface StudentWrittenProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Id of the written production. */
  writtenId: number;
  /** Nickname of the student. */
  student: string;
}

/**
 * The files uploaded by a student for each expected file of a written production.
 */
export function StudentWritten({ className, classroom, writtenId, student }: StudentWrittenProps) {
  const tr = useTranslation();
  const written = useStudentWritten(classroom, writtenId, student);

  if (written.isLoading) return <ViewSpinner />;
  if (written.error) return <div className={Styles.error}>{written.error.message}</div>;

  return (
    <div className={$.join(className, Styles.studentWritten)}>
      <h2>
        {written.name}{" "}
        <small>{tr.count$(String(written.uploadedCount), String(written.slots.length))}</small>
      </h2>
      {written.slots.map(({ slot, uploads }) => (
        <section key={slot}>
          <header>{slot}</header>
          {uploads.length === 0 && <em>{tr.missing}</em>}
          {uploads.map((upload) => (
            <StudentUpload
              key={upload.id}
              classroom={classroom}
              writtenId={writtenId}
              upload={upload}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
