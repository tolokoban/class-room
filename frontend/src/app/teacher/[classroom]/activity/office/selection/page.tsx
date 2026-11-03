import { useRouteParamAsString } from "@/app/routes";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";
import { SelectionResults } from "./_/SelectionResults";

/**
 * Scores of the students to the exercises of activity "office/selection".
 */
export default function Page() {
  const classroom = useRouteParamAsString("classroom");
  const user = State.user.useValue();

  if (!isTeacher(user)) return <TeacherOnly />;

  return <SelectionResults classroom={classroom} />;
}
