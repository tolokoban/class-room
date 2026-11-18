import { DemoContext, field, isInt, isNonEmptyString } from "../../context";
import {
  deleteUploads,
  findExpectedFile,
  findWritten,
  getUploadExtension,
  isMimeAccepted,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/upload-complete/index.php`.
 * There is no `finfo` in the browser: the mime type is the one given at `upload-init`.
 */
export default async function writtenUploadComplete(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const uploadId = field(input, "uploadId");
  const computer = field(input, "computer");
  if (!isInt(uploadId) || !isNonEmptyString(computer)) return -61601;

  const upload = await ctx.db.get("written_upload", uploadId);
  const assignment = upload ? await ctx.db.get("written_assignment", upload.assignment) : undefined;
  if (!upload || !assignment || upload.computer !== computer || upload.complete !== 0) {
    return -61602;
  }

  const content = await ctx.db.getContent("written_upload", uploadId);
  if (upload.received !== upload.size || content?.size !== upload.size) return -61603;

  const written = await findWritten(ctx, assignment.written);
  const expected = written === false ? false : findExpectedFile(written, upload.slot);
  const mime = upload.mime;
  if (expected === false || !isMimeAccepted(mime, expected)) {
    await deleteUploads(ctx, (u) => u.id === uploadId);
    return -61604;
  }

  const ext = getUploadExtension(mime, upload.original);
  const now = ctx.now();
  const late = assignment.end_time !== null && now > assignment.end_time;
  await ctx.db.setContent("written_upload", uploadId, new Blob([content], { type: mime }));
  await ctx.db.put("written_upload", {
    ...upload,
    complete: 1,
    mime,
    ext,
    late: late ? 1 : 0,
    time: now,
  });
  // The new file replaces the previous one.
  await deleteUploads(
    ctx,
    (u) =>
      u.assignment === upload.assignment &&
      u.computer === computer &&
      u.slot === upload.slot &&
      u.complete === 1 &&
      u.id !== uploadId,
  );

  return {
    slot: upload.slot,
    original: upload.original,
    mime,
    size: upload.size,
    late,
    time: now,
  };
}
