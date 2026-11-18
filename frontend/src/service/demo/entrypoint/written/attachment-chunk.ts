import { DemoContext, field, isInt } from "../../context";
import {
  decodeBase64,
  findOwnedAttachment,
  WRITTEN_MAX_CHUNK_SIZE,
  writeInBlob,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/attachment-chunk/index.php`.
 */
export default async function writtenAttachmentChunk(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const attachmentId = field(input, "attachmentId");
  const offset = field(input, "offset");
  const content = decodeBase64(field(input, "data"));
  if (!isInt(attachmentId) || !isInt(offset) || content === false) return -62001;

  const attachment = await findOwnedAttachment(ctx, attachmentId);
  if (typeof attachment === "string" || attachment.isComplete) return -62002;

  const length = content.length;
  if (
    length === 0 ||
    length > WRITTEN_MAX_CHUNK_SIZE ||
    offset < 0 ||
    offset > attachment.received ||
    offset + length > attachment.size
  ) {
    return -62003;
  }

  const partial = await ctx.db.getContent("written_attachment", attachmentId);
  await ctx.db.setContent(
    "written_attachment",
    attachmentId,
    writeInBlob(partial, offset, content),
  );
  const received = Math.max(attachment.received, offset + length);
  await ctx.db.update("written_attachment", attachmentId, { received, time: ctx.now() });

  return { received };
}
