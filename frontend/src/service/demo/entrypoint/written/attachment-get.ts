import { DemoContext, field, isInt, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { findAssignment, findAttachment, WRITTEN_ACTIVITY_PREFIX } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/attachment-get/index.php`.
 * It is only used as a link (see `getWrittenAttachmentUrl()`): the input is the query string.
 * @returns The content of the attachment, or an error code.
 */
export default async function writtenAttachmentGet(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  let attachmentId = field(input, "attachmentId");
  if (typeof attachmentId === "string" && /^\d+$/.test(attachmentId)) {
    attachmentId = Number(attachmentId);
  }
  const classroomCode = field(input, "classroomCode");
  if (!isInt(attachmentId) || (classroomCode !== null && typeof classroomCode !== "string")) {
    return -62301;
  }

  const attachment = await findAttachment(ctx, attachmentId);
  if (attachment === false || !attachment.isComplete) return -62302;
  if (!(await canGetAttachment(ctx, attachment, classroomCode))) return -62303;

  const content = await ctx.db.getContent("written_attachment", attachmentId);
  if (!content) return -62304;

  return new Blob([content], { type: attachment.mime });
}

/**
 * The owner can always get the file. The students only while the written production
 * is the current activity of the class room.
 */
async function canGetAttachment(
  ctx: DemoContext,
  attachment: { owner: number; written: number },
  classroomCode: string | null,
): Promise<boolean> {
  if (attachment.owner === ctx.user.id) return true;
  if (!isNonEmptyString(classroomCode)) return false;

  const found = await findClassByCode(ctx, classroomCode);
  return (
    found !== false &&
    found.activity === `${WRITTEN_ACTIVITY_PREFIX}${attachment.written}` &&
    (await findAssignment(ctx, attachment.written, found.id)) !== false
  );
}
