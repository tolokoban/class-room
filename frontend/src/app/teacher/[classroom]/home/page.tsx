import { ActivitiesList } from "@/components/ActivitiesList";
import { useRouteParamAsString } from "@/app/routes";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { ClassroomFiles } from "./_/ClassroomFiles";
import { ClassroomNotes } from "./_/ClassroomNotes";
import { CurrentActivity } from "./_/CurrentActivity";

import Styles from "./page.module.css";

export default function Page() {
  const classroom = useRouteParamAsString("classroom");
  const user = State.user.useValue();

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <section>
        <CurrentActivity classroom={classroom} />
        <ActivitiesList />
      </section>
      <div>
        <ClassroomFiles classroom={classroom} />
        {/* The key resets the draft of the notes when the class room changes. */}
        <ClassroomNotes key={classroom} classroom={classroom} />
      </div>
    </div>
  );
}
