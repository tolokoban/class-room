import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";

/**
 * Translation of `backend/www/api/entrypoint/room/check/index.php`.
 * @returns `true` if this computer still has a seat in the class room.
 */
export default async function roomCheck(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const computer = field(input, "computer");
  if (!isNonEmptyString(classroomCode) || !isNonEmptyString(computer)) return -40301;

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -40302;

  const seat = await ctx.db.get("seat", [found.id, computer]);
  if (!seat) return false;

  await ctx.db.put("seat", { ...seat, time: ctx.now() });
  return true;
}
