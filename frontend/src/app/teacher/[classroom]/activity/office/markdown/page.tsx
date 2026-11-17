import { EXERCISES } from "@/app/student/[classroom]/activity/office/markdown/exercises";
import {
  ACTIVITY_CODE,
  parseScores,
} from "@/app/student/[classroom]/activity/office/markdown/_/progress";
import { gotoTarget, useRouteParamAsString } from "@/app/routes";
import { ExerciseScores } from "@/components/ExerciseScores";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";
import { useTranslation } from "./_/translation";

/**
 * Exercises done right by the students in activity "office/markdown".
 */
export default function Page() {
  const tr = useTranslation();
  const classroom = useRouteParamAsString("classroom");
  const user = State.user.useValue();

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <ExerciseScores
      title={tr.title}
      classroom={classroom}
      activityCode={ACTIVITY_CODE}
      exercises={EXERCISES}
      parseResult={parseScores}
      onBack={() => gotoTarget(null, "/student/[classroom]/activity/office/markdown", classroom)}
    />
  );
}
