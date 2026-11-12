import { useRouteParamAsString } from "@/app/routes";
import { ActivitiesList } from "@/components/ActivitiesList";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { ClassroomFiles } from "./_/ClassroomFiles";
import { ClassroomNotes } from "./_/ClassroomNotes";
import { CurrentActivity } from "./_/CurrentActivity";
import { SectionHeader } from "./_/SectionHeader";
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
      <section>
        <SectionHeader
          expanded={section.isExpanded("activities")}
          onToggle={() => section.toggle("activities")}
        >
          {tr.activities}
        </SectionHeader>
        <CurrentActivity classroom={classroom} />
        {section.isExpanded("activities") && <ActivitiesList />}
      </section>
      <div>
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
