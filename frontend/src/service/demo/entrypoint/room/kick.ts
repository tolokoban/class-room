import { DemoContext, field, isNonEmptyString } from "../../context";
import { sameText } from "../../lib/class";
import { findOwnedClass } from "../../lib/room";

/**
 * Translation of `backend/www/api/entrypoint/room/kick/index.php`.
 * Free the seat of a student (or all the seats if `nickname` is missing).
 * @returns The number of freed seats.
 */
export default async function roomKick(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const nickname = field(input, "nickname");
  if (!isNonEmptyString(classroomCode) || (nickname !== null && typeof nickname !== "string")) {
    return -40501;
  }

  const found = await findOwnedClass(ctx, classroomCode);
  if (found === "missing") return -40502;
  if (found === "forbidden") return -40503;

  return ctx.db.deleteWhere(
    "seat",
    (seat) =>
      seat.classroom === found.id && (nickname === null || sameText(seat.nickname, nickname)),
  );
}
