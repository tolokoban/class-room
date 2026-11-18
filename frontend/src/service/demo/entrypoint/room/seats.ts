import { DemoContext, field, isNonEmptyString } from "../../context";
import { compareText } from "../../lib/class";
import { findOwnedClass } from "../../lib/room";

/**
 * Translation of `backend/www/api/entrypoint/room/seats/index.php`.
 */
export default async function roomSeats(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  if (!isNonEmptyString(classroomCode)) return -40401;

  const found = await findOwnedClass(ctx, classroomCode);
  if (found === "missing") return -40402;
  if (found === "forbidden") return -40403;

  const seats = await ctx.db.where("seat", (seat) => seat.classroom === found.id);
  const assignments = new Set(
    (await ctx.db.where("written_assignment", (item) => item.classroom === found.id)).map(
      (item) => item.id,
    ),
  );
  const uploads = await ctx.db.where(
    "written_upload",
    (upload) => upload.complete === 1 && assignments.has(upload.assignment),
  );

  return {
    maxStudents: found.maxStudents,
    now: ctx.now(),
    seats: seats
      .sort((a, b) => compareText(a.nickname, b.nickname))
      .map((seat) => ({
        nickname: seat.nickname,
        time: seat.time,
        uploads: uploads.filter((upload) => upload.computer === seat.computer).length,
      })),
  };
}
