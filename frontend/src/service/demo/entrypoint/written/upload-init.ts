import { DemoContext, field, isInt, isNonEmptyString } from "../../context";
import {
  canUpload,
  collectWrittenGarbage,
  deleteUploads,
  findExpectedFile,
  findSeat,
  getUploadExtension,
  guessMime,
  isMimeAccepted,
  normalizeMime,
  resolvePublicAssignment,
  sanitizeFileName,
  WRITTEN_MAX_CHUNK_SIZE,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/upload-init/index.php`.
 */
export default async function writtenUploadInit(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const computer = field(input, "computer");
  const slot = field(input, "slot");
  const name = sanitizeFileName(field(input, "name"));
  const size = field(input, "size");
  if (!isNonEmptyString(computer) || typeof slot !== "string" || name === false || !isInt(size)) {
    return -61401;
  }
  let mime = normalizeMime(field(input, "mime"));

  const resolved = await resolvePublicAssignment(
    ctx,
    field(input, "writtenId"),
    field(input, "classroomCode"),
    61400,
  );
  if (typeof resolved === "number") return resolved;

  const { class: classInfo, written, assignment } = resolved;
  const seat = await findSeat(ctx, classInfo.id, computer);
  if (seat === false) return -61404;

  const allowed = canUpload(ctx, assignment);
  if (allowed !== true) return allowed === "idle" ? -61405 : -61406;

  const expected = findExpectedFile(written, slot);
  if (expected === false) return -61407;
  if (size < 1 || size > expected.maxSize) return -61408;

  mime = guessMime(mime, name, expected);
  if (!isMimeAccepted(mime, expected)) return -61409;

  await collectWrittenGarbage(ctx);
  await deleteUploads(
    ctx,
    (u) =>
      u.assignment === assignment.id &&
      u.computer === computer &&
      u.slot === slot &&
      u.complete === 0,
  );
  const uploadId = await ctx.db.insert("written_upload", {
    assignment: assignment.id,
    computer,
    nickname: seat.nickname,
    slot,
    original: name,
    mime,
    ext: getUploadExtension(mime, name),
    size,
    received: 0,
    complete: 0,
    late: 0,
    time: ctx.now(),
  });
  await ctx.db.setContent("written_upload", uploadId, new Blob([]));

  return { uploadId, chunkSize: WRITTEN_MAX_CHUNK_SIZE };
}
