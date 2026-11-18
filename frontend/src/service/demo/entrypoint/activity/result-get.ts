import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { sameText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/activity/result-get/index.php`.
 */
export default async function activityResultGet(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const activityCode = field(input, "activityCode");
  const computer = field(input, "computer");
  const nickname = field(input, "nickname");
  if (
    !isNonEmptyString(classroomCode) ||
    !isNonEmptyString(activityCode) ||
    !isNonEmptyString(computer) ||
    !isNonEmptyString(nickname)
  ) {
    return -30601;
  }

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -30602;

  const row = await ctx.db.findOne(
    "activity",
    (item) =>
      item.classroom === found.id &&
      sameText(item.code, activityCode) &&
      sameText(item.nickname, nickname.trim()),
  );
  if (!row) return null;
  if (row.computer !== computer) return -30603;

  return row.result;
}
