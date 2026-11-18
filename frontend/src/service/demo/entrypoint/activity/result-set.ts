import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { sameText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/activity/result-set/index.php`.
 */
export default async function activityResultSet(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const activityCode = field(input, "activityCode");
  const computer = field(input, "computer");
  const nickname = field(input, "nickname");
  const result = field(input, "result");
  if (
    !isNonEmptyString(classroomCode) ||
    !isNonEmptyString(activityCode) ||
    !isNonEmptyString(computer) ||
    !isNonEmptyString(nickname) ||
    typeof result !== "string"
  ) {
    return -30101;
  }

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -30102;

  const name = nickname.trim();
  const row = await ctx.db.findOne(
    "activity",
    (item) =>
      item.classroom === found.id &&
      sameText(item.code, activityCode) &&
      sameText(item.nickname, name),
  );
  if (!row) {
    await ctx.db.insert("activity", {
      classroom: found.id,
      code: activityCode,
      computer,
      nickname: name,
      result,
    });
    return 0;
  }
  if (row.computer !== computer) return -30103;

  await ctx.db.update("activity", row.id, { result });
  return 0;
}
