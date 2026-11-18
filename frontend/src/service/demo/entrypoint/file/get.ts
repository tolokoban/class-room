import { DemoContext, field, isInt } from "../../context";
import { findFile } from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/get/index.php`.
 * It is only used as a link (`api/file/get?fileId=N`): in demo mode, the links
 * are registered by `file/list` (see `registerDemoUrl()`).
 * The input is the query string: `fileId` can be a string of digits.
 * @returns The content of the file, or an error code.
 */
export default async function fileGet(input: unknown, ctx: DemoContext): Promise<unknown> {
  let fileId = field(input, "fileId");
  if (typeof fileId === "string" && /^\d+$/.test(fileId)) fileId = Number(fileId);
  if (!isInt(fileId)) return -50501;

  const file = await findFile(ctx, fileId);
  if (file === false) return -50502;
  if (file.user !== ctx.user.id) return -50503;

  const blob = await ctx.db.getContent("files", fileId);
  if (!blob) return -50504;

  return blob.type === file.mime ? blob : new Blob([blob], { type: file.mime });
}
