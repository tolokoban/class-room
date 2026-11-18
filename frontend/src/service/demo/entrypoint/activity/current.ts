import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";

/**
 * Translation of `backend/www/api/entrypoint/activity/current/index.php`.
 */
export default async function activityCurrent(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  if (!isNonEmptyString(classroomCode)) return -30401;

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -30402;

  return found.activity;
}
