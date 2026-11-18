import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { compareText, sameText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/room/students/index.php`.
 * @returns The nicknames of the students who entered this class room.
 */
export default async function roomStudents(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  if (!isNonEmptyString(classroomCode)) return -40201;

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -40202;
  if (found.user !== ctx.user.id) return -40203;

  const nicknames: string[] = [];
  for (const row of await ctx.db.where("room", (item) => item.classroom === found.id)) {
    if (!nicknames.some((name) => sameText(name, row.nickname))) nicknames.push(row.nickname);
  }
  return nicknames.sort(compareText);
}
