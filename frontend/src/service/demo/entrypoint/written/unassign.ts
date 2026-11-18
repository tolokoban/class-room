import { DemoContext, field } from "../../context";
import { clearWrittenActivity, deleteUploads, resolveAssignment } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/unassign/index.php`.
 */
export default async function writtenUnassign(input: unknown, ctx: DemoContext): Promise<unknown> {
  const resolved = await resolveAssignment(
    ctx,
    field(input, "writtenId"),
    field(input, "classroomCode"),
    60600,
  );
  if (typeof resolved === "number") return resolved;

  const { class: classInfo, written, assignment } = resolved;
  const deleted = await deleteUploads(ctx, (_u, a) => a.id === assignment.id);
  await ctx.db.delete("written_assignment", assignment.id);
  await clearWrittenActivity(ctx, written.id, (row) => row.id === classInfo.id);
  return deleted;
}
