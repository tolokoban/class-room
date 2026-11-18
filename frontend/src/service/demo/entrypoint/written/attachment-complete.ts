import { DemoContext, field, isInt } from "../../context";
import {
  deleteAttachments,
  findOwnedAttachment,
  getUploadExtension,
  registerAttachmentUrls,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/attachment-complete/index.php`.
 * There is no `finfo` in the browser: the mime type is the one given at `attachment-init`.
 */
export default async function writtenAttachmentComplete(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const attachmentId = field(input, "attachmentId");
  if (!isInt(attachmentId)) return -62101;

  const attachment = await findOwnedAttachment(ctx, attachmentId);
  if (typeof attachment === "string" || attachment.isComplete) return -62102;

  const content = await ctx.db.getContent("written_attachment", attachmentId);
  if (attachment.received !== attachment.size || content?.size !== attachment.size) return -62103;

  const mime = attachment.mime;
  const ext = getUploadExtension(mime, attachment.name);
  await ctx.db.setContent("written_attachment", attachmentId, new Blob([content], { type: mime }));
  await ctx.db.update("written_attachment", attachmentId, {
    complete: 1,
    mime,
    ext,
    time: ctx.now(),
  });
  // The new file replaces the previous one.
  await deleteAttachments(
    ctx,
    (row) =>
      row.written === attachment.written &&
      row.name === attachment.name &&
      row.complete === 1 &&
      row.id !== attachmentId,
  );
  const row = await ctx.db.get("written_attachment", attachmentId);
  if (row) await registerAttachmentUrls(ctx, row);

  return { id: attachmentId, name: attachment.name, mime, size: attachment.size };
}
