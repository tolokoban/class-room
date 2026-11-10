import { EXERCISES } from "@/app/student/[classroom]/activity/office/selection/exercices";
import { ACTIVITY_CODE } from "@/app/student/[classroom]/activity/office/selection/_/scores";
import { gotoTarget, useRouteParamAsString } from "@/app/routes";
import { ExerciseScores } from "@/components/ExerciseScores";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";
import { useTranslation } from "./_/translation";

/**
 * Scores of the students to the exercises of activity "office/selection".
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
      onBack={() => gotoTarget(null, "/student/[classroom]/activity/office/selection", classroom)}
    />
  );
}
