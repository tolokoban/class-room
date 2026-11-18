import { DemoContext, field, isInt } from "../../context";
import {
  collectWrittenGarbage,
  deleteAttachments,
  getUploadExtension,
  guessAttachmentMime,
  listAttachments,
  normalizeMime,
  resolveOwnedWritten,
  sanitizeFileName,
  WRITTEN_MAX_ATTACHMENT_SIZE,
  WRITTEN_MAX_ATTACHMENTS,
  WRITTEN_MAX_CHUNK_SIZE,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/attachment-init/index.php`.
 */
export default async function writtenAttachmentInit(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const name = sanitizeFileName(field(input, "name"));
  const size = field(input, "size");
  if (name === false || !isInt(size)) return -61901;

  const mime = guessAttachmentMime(normalizeMime(field(input, "mime")), name);
  const written = await resolveOwnedWritten(ctx, field(input, "writtenId"), 61900);
  if (typeof written === "number") return written;
  if (size < 1 || size > WRITTEN_MAX_ATTACHMENT_SIZE) return -61905;

  // A file with the same name replaces the existing one: it does not count.
  const others = (await listAttachments(ctx, written.id)).filter(
    (attachment) => attachment.name.toLowerCase() !== name.toLowerCase(),
  );
  if (others.length >= WRITTEN_MAX_ATTACHMENTS) return -61904;

  await collectWrittenGarbage(ctx);
  await deleteAttachments(
    ctx,
    (row) => row.written === written.id && row.name === name && row.complete === 0,
  );
  const attachmentId = await ctx.db.insert("written_attachment", {
    written: written.id,
    name,
    mime,
    ext: getUploadExtension(mime, name),
    size,
    received: 0,
    complete: 0,
    time: ctx.now(),
  });
  await ctx.db.setContent("written_attachment", attachmentId, new Blob([]));

  return { attachmentId, chunkSize: WRITTEN_MAX_CHUNK_SIZE };
}
