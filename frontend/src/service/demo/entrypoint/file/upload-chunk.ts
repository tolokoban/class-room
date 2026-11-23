import { DemoContext, field, isInt } from "../../context";
import { FILE_MAX_CHUNK_SIZE, findOwnedFileUpload } from "../../lib/file";
import { decodeBase64, writeInBlob } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/file/upload-chunk/index.php`.
 */
export default async function fileUploadChunk(input: unknown, ctx: DemoContext): Promise<unknown> {
  const uploadId = field(input, "uploadId");
  const offset = field(input, "offset");
  const content = decodeBase64(field(input, "data"));
  if (!isInt(uploadId) || !isInt(offset) || content === false) return -50901;

  const upload = await findOwnedFileUpload(ctx, uploadId);
  if (upload === false) return -50902;

  const length = content.length;
  if (
    length === 0 ||
    length > FILE_MAX_CHUNK_SIZE ||
    offset < 0 ||
    offset > upload.received ||
    offset + length > upload.size
  ) {
    return -50903;
  }

  const partial = await ctx.db.getContent("file_upload", uploadId);
  await ctx.db.setContent("file_upload", uploadId, writeInBlob(partial, offset, content));
  const received = Math.max(upload.received, offset + length);
  await ctx.db.update("file_upload", uploadId, { received, time: ctx.now() });

  return { received };
}
