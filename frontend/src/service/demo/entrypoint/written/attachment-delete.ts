import { DemoContext, field, isInt } from "../../context";
import { deleteAttachments, findOwnedAttachment } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/attachment-delete/index.php`.
 */
export default async function writtenAttachmentDelete(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const attachmentId = field(input, "attachmentId");
  if (!isInt(attachmentId)) return -62201;

  const attachment = await findOwnedAttachment(ctx, attachmentId);
  if (attachment === "missing") return -62202;
  if (attachment === "forbidden") return -62203;

  await deleteAttachments(ctx, (row) => row.id === attachmentId);
  return 0;
}
