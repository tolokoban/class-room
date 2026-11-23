import { useRouteParamAsString } from "@/app/routes";
import { ActivitiesList } from "@/components/ActivitiesList";
import { SectionHeader } from "@/components/SectionHeader";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { ClassroomFiles } from "./_/ClassroomFiles";
import { ClassroomNotes } from "./_/ClassroomNotes";
import { ClassroomStudents } from "./_/ClassroomStudents";
import { CurrentActivity } from "./_/CurrentActivity";
import { WrittenProductions } from "./_/WrittenProductions";
import { useExpandedSection } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

export default function Page() {
  const tr = useTranslation();
  const classroom = useRouteParamAsString("classroom");
  const user = State.user.useValue();
  const section = useExpandedSection();

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <div>
        <CurrentActivity classroom={classroom} />
        <SectionHeader
          expanded={section.isExpanded("activities")}
          onToggle={() => section.toggle("activities")}
        >
          {tr.activities}
        </SectionHeader>
        {section.isExpanded("activities") && (
          <section>
            <ActivitiesList />
          </section>
        )}
        <WrittenProductions
          classroom={classroom}
          expanded={section.isExpanded("written")}
          onToggle={() => section.toggle("written")}
        />
        <ClassroomStudents
          classroom={classroom}
          expanded={section.isExpanded("students")}
          onToggle={() => section.toggle("students")}
        />
        <ClassroomFiles
          classroom={classroom}
          expanded={section.isExpanded("files")}
          onToggle={() => section.toggle("files")}
        />
        {/* The key resets the draft of the notes when the class room changes. */}
        <ClassroomNotes
          key={classroom}
          classroom={classroom}
          expanded={section.isExpanded("notes")}
          onToggle={() => section.toggle("notes")}
        />
      </div>
    </div>
  );
}
