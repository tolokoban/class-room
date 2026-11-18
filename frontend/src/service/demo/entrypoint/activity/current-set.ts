import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";

const ACTIVITY_CODE_PATTERN = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/;

/**
 * Translation of `backend/www/api/entrypoint/activity/current-set/index.php`.
 */
export default async function activityCurrentSet(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const activityCode = field(input, "activityCode");
  if (
    !isNonEmptyString(classroomCode) ||
    (activityCode !== null &&
      (typeof activityCode !== "string" || !ACTIVITY_CODE_PATTERN.test(activityCode)))
  ) {
    return -30501;
  }

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -30502;
  if (found.user !== ctx.user.id) return -30503;

  await ctx.db.update("class", found.id, { activity: activityCode });
  return 0;
}
