import { isString } from "@tolokoban/type-guards";

import { isTeacher, State } from "@/state";

import { StudentHome } from "./_/StudentHome";
import { TeacherHome } from "./_/TeacherHome";

export default function Page() {
  const user = State.user.useValue();

  if (isTeacher(user)) return <TeacherHome />;
  if (isString(user)) return <StudentHome user={user} />;
  return null;
}
