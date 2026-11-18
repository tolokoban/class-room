import { DemoContext, field, isNonEmptyString } from "../../context";
import { deleteUploads, findSeat, resolvePublicAssignment } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/upload-delete/index.php`.
 */
export default async function writtenUploadDelete(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const computer = field(input, "computer");
  const slot = field(input, "slot");
  if (!isNonEmptyString(computer) || typeof slot !== "string") return -61701;

  const resolved = await resolvePublicAssignment(
    ctx,
    field(input, "writtenId"),
    field(input, "classroomCode"),
    61700,
  );
  if (typeof resolved === "number") return resolved;

  const { class: classInfo, assignment } = resolved;
  if ((await findSeat(ctx, classInfo.id, computer)) === false) return -61704;

  return deleteUploads(
    ctx,
    (u) => u.assignment === assignment.id && u.computer === computer && u.slot === slot,
  );
}
