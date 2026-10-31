import { ActivitiesList } from "@/components/ActivitiesList";
import { isTeacher, State } from "@/state";

import { CurrentActivity } from "./_/CurrentActivity";
import { TeacherOnly } from "./_/TeacherOnly";

import Styles from "./page.module.css";
import { useRouteParamAsString } from "@/app/routes";

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
    </div>
  );
}
