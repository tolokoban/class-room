import { ActivitiesList } from "@/components/ActivitiesList";
import { isTeacher, State } from "@/state";

import { CurrentActivity } from "./_/CurrentActivity";
import { TeacherOnly } from "./_/TeacherOnly";

import Styles from "./page.module.css";

export default function Page({ params }: { params: Record<string, string> }) {
  const user = State.user.useValue();

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <section>
        <CurrentActivity classroom={params.classroom ?? ""} />
        <ActivitiesList />
      </section>
    </div>
  );
}
