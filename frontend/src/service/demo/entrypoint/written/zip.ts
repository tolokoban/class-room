import { DemoContext, field, isInt } from "../../context";
import { getUploadDownloadName, listUploads, resolveAssignment, Upload } from "../../lib/written";
import { makeZip, ZipEntry } from "../../lib/zip";

/**
 * Translation of `backend/www/api/entrypoint/written/zip/index.php`.
 * It is only used as a link (see `getWrittenZipUrl()`): the input is the query string.
 * @returns The ZIP archive of all the uploads, or an error code.
 */
export default async function writtenZip(input: unknown, ctx: DemoContext): Promise<unknown> {
  let writtenId = field(input, "writtenId");
  if (typeof writtenId === "string" && /^\d+$/.test(writtenId)) writtenId = Number(writtenId);
  const classroomCode = field(input, "classroomCode");
  const resolved = await resolveAssignment(
    ctx,
    isInt(writtenId) ? writtenId : null,
    classroomCode,
    61200,
  );
  if (typeof resolved === "number") return resolved;

  return makeZipOfUploads(ctx, await listUploads(ctx, resolved.assignment.id));
}

export async function makeZipOfUploads(ctx: DemoContext, uploads: Upload[]): Promise<Blob> {
  const entries: ZipEntry[] = [];
  for (const upload of uploads) {
    const content = await ctx.db.getContent("written_upload", upload.id);
    if (!content) continue;

    entries.push({
      name: await getUploadDownloadName(upload.nickname, upload.slot, upload.computer, upload.ext),
      content,
    });
  }
  return makeZip(entries, ctx.now());
}
