import { DemoContext, field } from "../../context";
import {
  collectWrittenGarbage,
  formatAssignment,
  getTimer,
  resolveOwnedClass,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/classroom/index.php`.
 */
export default async function writtenClassroom(input: unknown, ctx: DemoContext): Promise<unknown> {
  const found = await resolveOwnedClass(ctx, field(input, "classroomCode"), 60700);
  if (typeof found === "number") return found;

  await collectWrittenGarbage(ctx);
  const assignments = (
    await ctx.db.where("written_assignment", (row) => row.classroom === found.id)
  ).sort((a, b) => a.position - b.position || a.id - b.id);
  const uploads = await ctx.db.where("written_upload", (row) => row.complete === 1);
  const items: unknown[] = [];
  for (const row of assignments) {
    const written = await ctx.db.get("written", row.written);
    if (!written) continue;

    const files = uploads.filter((upload) => upload.assignment === row.id);
    items.push({
      id: row.written,
      name: written.name,
      timer: getTimer(formatAssignment(row)),
      count: files.length,
      size: files.reduce((sum, upload) => sum + upload.size, 0),
    });
  }
  return { now: ctx.now(), items };
}
