import { ActivitiesList } from "@/components/ActivitiesList";
import { useRouteParamAsString } from "@/app/routes";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { ClassroomFiles } from "./_/ClassroomFiles";
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
      <ClassroomFiles classroom={classroom} />
    </div>
  );
}
