import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { sameText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/activity/clear/index.php`.
 */
export default async function activityClear(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const activityCode = field(input, "activityCode");
  if (
    !isNonEmptyString(classroomCode) ||
    (activityCode !== null && !isNonEmptyString(activityCode))
  ) {
    return -30301;
  }

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -30302;
  if (found.user !== ctx.user.id) return -30303;

  await ctx.db.deleteWhere(
    "activity",
    (row) =>
      row.classroom === found.id && (activityCode === null || sameText(row.code, activityCode)),
  );
  return 0;
}
