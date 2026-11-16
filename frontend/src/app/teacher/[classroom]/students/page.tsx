import { IconArrowLeft, ViewButton } from "@tolokoban/ui";

import { useRouteParamAsString } from "@/app/routes";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { MaxStudents } from "./_/MaxStudents";
import { SeatsList } from "./_/SeatsList";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

/**
 * Management of the students connected to a class room.
 */
export default function Page() {
  const tr = useTranslation();
  const user = State.user.useValue();
  const classroom = useRouteParamAsString("classroom");

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <nav>
        <ViewButton variant="text" icon={IconArrowLeft} onClick={`#/teacher/${classroom}/home`}>
          {tr.back}
        </ViewButton>
      </nav>
      <MaxStudents classroom={classroom} />
      <SeatsList classroom={classroom} />
    </div>
  );
}
