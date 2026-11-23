import { IconUser, Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { SectionHeader } from "@/components/SectionHeader";
import { useServiceRoomSeats } from "@/service/hooks/room";

import { useTranslation } from "./translation";

import Styles from "./ClassroomStudents.module.css";

const $ = Theme.classNames;

export interface ClassroomStudentsProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Is the content of the section visible? */
  expanded: boolean;
  /** Called when the user clicks the header. */
  onToggle(): void;
}

/**
 * Number of students connected to a class room, and a link to manage them.
 */
export function ClassroomStudents({
  className,
  classroom,
  expanded,
  onToggle,
}: ClassroomStudentsProps) {
  const tr = useTranslation();
  const { data, isLoading, error } = useServiceRoomSeats(classroom);

  return (
    <section className={$.join(className, Styles.classroomStudents)}>
      <SectionHeader expanded={expanded} onToggle={onToggle}>
        {tr.title}
        {data && ` (${data.seats.length} / ${data.maxStudents})`}
      </SectionHeader>
      {expanded && (
        <>
          <div>
            {isLoading && <ViewSpinner />}
            {error && <div className={Styles.error}>{error.message}</div>}
            {data && tr.seats$(String(data.seats.length), String(data.maxStudents))}
          </div>
          <footer>
            <ViewButton icon={IconUser} onClick={`#/teacher/${classroom}/students`}>
              {tr.manage}
            </ViewButton>
          </footer>
        </>
      )}
    </section>
  );
}
