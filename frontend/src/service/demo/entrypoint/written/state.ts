import { DemoContext, field, isNonEmptyString } from "../../context";
import {
  findSeat,
  getPublicUpload,
  getTimer,
  getWrittenInfos,
  isClassOwner,
  listUploads,
  resolvePublicAssignment,
  WRITTEN_ACTIVITY_PREFIX,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/state/index.php`.
 */
export default async function writtenState(input: unknown, ctx: DemoContext): Promise<unknown> {
  const computer = field(input, "computer");
  if (computer !== null && !isNonEmptyString(computer)) return -61301;

  const classroomCode = field(input, "classroomCode");
  const resolved = await resolvePublicAssignment(
    ctx,
    field(input, "writtenId"),
    classroomCode,
    61300,
  );
  if (typeof resolved === "number") return resolved;

  const { class: classInfo, written, assignment } = resolved;
  const preview = isClassOwner(ctx, classInfo);
  if (!preview && classInfo.activity !== `${WRITTEN_ACTIVITY_PREFIX}${written.id}`) return -61304;

  const uploads =
    computer === null ? [] : (await listUploads(ctx, assignment.id, computer)).map(getPublicUpload);
  return {
    ...(await getWrittenInfos(ctx, written, classroomCode as string)),
    now: ctx.now(),
    preview,
    seated: computer !== null && (await findSeat(ctx, classInfo.id, computer)) !== false,
    timer: getTimer(assignment),
    uploads,
  };
}
