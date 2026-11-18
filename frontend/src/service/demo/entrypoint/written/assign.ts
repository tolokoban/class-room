import { DemoContext, field } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { resolveAssignment } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/assign/index.php`.
 */
export default async function writtenAssign(input: unknown, ctx: DemoContext): Promise<unknown> {
  const writtenId = field(input, "writtenId");
  const classroomCode = field(input, "classroomCode");
  const resolved = await resolveAssignment(ctx, writtenId, classroomCode, 60500);
  if (typeof resolved !== "number") return -60506;
  if (resolved !== -60506) return resolved;

  const found = await findClassByCode(ctx, classroomCode as string);
  if (found === false) return -60507;

  const positions = (
    await ctx.db.where("written_assignment", (row) => row.classroom === found.id)
  ).map((row) => row.position);
  await ctx.db.insert("written_assignment", {
    written: writtenId as number,
    classroom: found.id,
    end_time: null,
    remaining: null,
    extension: 0,
    expires_at: null,
    position: Math.max(0, ...positions) + 1,
  });
  return 0;
}
