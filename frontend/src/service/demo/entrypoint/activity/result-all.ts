import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { compareText, sameText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/activity/result-all/index.php`.
 * @returns An object: nickname => result.
 */
export default async function activityResultAll(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const activityCode = field(input, "activityCode");
  if (!isNonEmptyString(classroomCode) || !isNonEmptyString(activityCode)) return -30201;

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -30202;
  if (found.user !== ctx.user.id) return -30203;

  const rows = await ctx.db.where(
    "activity",
    (row) => row.classroom === found.id && sameText(row.code, activityCode),
  );
  const results: Record<string, string> = {};
  for (const row of rows.sort((a, b) => compareText(a.nickname, b.nickname))) {
    results[row.nickname] = row.result ?? "";
  }
  return results;
}
