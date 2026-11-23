import { DemoContext, field, isInt } from "../../context";
import { findOwnedFileUpload, isFileNameUsed, registerFileUrl } from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/upload-complete/index.php`.
 * The unique key `(classroom, name)` of table `files` is checked by hand.
 */
export default async function fileUploadComplete(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const uploadId = field(input, "uploadId");
  if (!isInt(uploadId)) return -51001;

  const upload = await findOwnedFileUpload(ctx, uploadId);
  if (upload === false) return -51002;

  const content = await ctx.db.getContent("file_upload", uploadId);
  if (upload.received !== upload.size || content?.size !== upload.size) return -51003;

  const { classroom, name, size, mime } = upload;
  if (upload.file !== null && !(await ctx.db.get("files", upload.file))) return -51002;
  if (await isFileNameUsed(ctx, classroom, name, upload.file)) return -51004;

  const fileId = upload.file ?? (await ctx.db.insert("files", { classroom, name, size, mime }));
  await ctx.db.update("files", fileId, { name, size });
  const blob = new Blob([content], { type: mime });
  await ctx.db.setContent("files", fileId, blob);
  await ctx.db.delete("file_upload", uploadId);
  registerFileUrl(fileId, blob, mime);

  return { fileId };
}
