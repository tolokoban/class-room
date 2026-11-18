import { DemoContext, field, isInt } from "../../context";
import { resolveOwnedClass } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/reorder/index.php`.
 */
export default async function writtenReorder(input: unknown, ctx: DemoContext): Promise<unknown> {
  const writtenIds = field(input, "writtenIds");
  if (!Array.isArray(writtenIds)) return -61801;

  for (const id of writtenIds) {
    if (!isInt(id)) return -61801;
  }
  const found = await resolveOwnedClass(ctx, field(input, "classroomCode"), 61800);
  if (typeof found === "number") return found;

  const assignments = await ctx.db.where("written_assignment", (row) => row.classroom === found.id);
  const expected = assignments.map((row) => row.written).sort((a, b) => a - b);
  const received = [...(writtenIds as number[])].sort((a, b) => a - b);
  if (JSON.stringify(expected) !== JSON.stringify(received)) return -61804;

  for (const [index, writtenId] of (writtenIds as number[]).entries()) {
    for (const row of assignments.filter((item) => item.written === writtenId)) {
      await ctx.db.put("written_assignment", { ...row, position: index + 1 });
    }
  }
  return 0;
}
