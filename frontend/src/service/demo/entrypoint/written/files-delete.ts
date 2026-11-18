import { DemoContext, field } from "../../context";
import { deleteUploads, resolveAssignment, resolveOwnedClass } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/files-delete/index.php`.
 */
export default async function writtenFilesDelete(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const writtenId = field(input, "writtenId");
  const classroomCode = field(input, "classroomCode");
  if (writtenId === null) {
    const found = await resolveOwnedClass(ctx, classroomCode, 61000);
    if (typeof found === "number") return found;

    return deleteUploads(ctx, (_u, a) => a.classroom === found.id);
  }
  const resolved = await resolveAssignment(ctx, writtenId, classroomCode, 61000);
  if (typeof resolved === "number") return resolved;

  return deleteUploads(ctx, (_u, a) => a.id === resolved.assignment.id);
}
