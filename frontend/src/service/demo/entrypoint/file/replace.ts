import { DemoContext, field, isInt } from "../../context";
import {
  findFile,
  isFileNameUsed,
  isReservedFileName,
  parseDataUrl,
  registerFileUrl,
  sanitizeFileName,
} from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/replace/index.php`.
 */
export default async function fileReplace(input: unknown, ctx: DemoContext): Promise<unknown> {
  const fileId = field(input, "fileId");
  const name = sanitizeFileName(field(input, "name"));
  const data = parseDataUrl(field(input, "file"));
  if (!isInt(fileId) || name === false || data === false) return -50201;
  if (isReservedFileName(name)) return -50208;

  const file = await findFile(ctx, fileId);
  if (file === false) return -50202;
  if (file.user !== ctx.user.id) return -50203;
  if (isReservedFileName(file.name)) return -50208;
  if (await isFileNameUsed(ctx, file.classroom, name, fileId)) return -50204;
  if (data.mime !== file.mime) return -50205;

  await ctx.db.update("files", fileId, { name, size: data.content.size });
  await ctx.db.setContent("files", fileId, data.content);
  registerFileUrl(fileId, data.content, data.mime);
  return { fileId };
}
