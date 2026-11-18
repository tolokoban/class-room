import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import {
  isFileNameUsed,
  isReservedFileName,
  parseDataUrl,
  registerFileUrl,
  sanitizeFileName,
} from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/add/index.php`.
 */
export default async function fileAdd(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const name = sanitizeFileName(field(input, "name"));
  const data = parseDataUrl(field(input, "file"));
  if (!isNonEmptyString(classroomCode) || name === false || data === false) return -50101;
  if (isReservedFileName(name)) return -50107;

  const classroom = await findClassByCode(ctx, classroomCode);
  if (classroom === false) return -50102;
  if (classroom.user !== ctx.user.id) return -50103;
  if (await isFileNameUsed(ctx, classroom.id, name)) return -50104;

  const fileId = await ctx.db.insert("files", {
    classroom: classroom.id,
    name,
    size: data.content.size,
    mime: data.mime,
  });
  await ctx.db.setContent("files", fileId, data.content);
  registerFileUrl(fileId, data.content, data.mime);
  return { fileId };
}
