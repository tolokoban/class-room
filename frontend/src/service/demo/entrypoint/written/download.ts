import { DemoContext, field, isInt } from "../../context";

/**
 * Translation of `backend/www/api/entrypoint/written/download/index.php`.
 * It is only used as a link (see `getWrittenUploadUrl()`): the input is the query string.
 * @returns The content of the upload, or an error code.
 */
export default async function writtenDownload(input: unknown, ctx: DemoContext): Promise<unknown> {
  let uploadId = field(input, "uploadId");
  if (typeof uploadId === "string" && /^\d+$/.test(uploadId)) uploadId = Number(uploadId);
  if (!isInt(uploadId)) return -61101;

  const upload = await ctx.db.get("written_upload", uploadId);
  const assignment = upload ? await ctx.db.get("written_assignment", upload.assignment) : undefined;
  const classRow = assignment ? await ctx.db.get("class", assignment.classroom) : undefined;
  if (!upload || !classRow || upload.complete !== 1) return -61102;
  if (classRow.user !== ctx.user.id) return -61103;

  const content = await ctx.db.getContent("written_upload", uploadId);
  if (!content) return -61104;

  return new Blob([content], { type: upload.mime });
}
