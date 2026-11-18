import { DemoContext, field, isInt } from "../../context";
import { findFile, getFileApiUrl } from "../../lib/file";
import { forgetDemoUrl } from "../../urls";

/**
 * Translation of `backend/www/api/entrypoint/file/delete/index.php`.
 * The content is deleted with the row.
 */
export default async function fileDelete(input: unknown, ctx: DemoContext): Promise<unknown> {
  const fileId = field(input, "fileId");
  if (!isInt(fileId)) return -50301;

  const file = await findFile(ctx, fileId);
  if (file === false) return -50302;
  if (file.user !== ctx.user.id) return -50303;

  await ctx.db.delete("files", fileId);
  forgetDemoUrl(getFileApiUrl(fileId));
  return true;
}
