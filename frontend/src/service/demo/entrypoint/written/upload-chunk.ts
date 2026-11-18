import { DemoContext, field, isInt, isNonEmptyString } from "../../context";
import { decodeBase64, WRITTEN_MAX_CHUNK_SIZE, writeInBlob } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/upload-chunk/index.php`.
 */
export default async function writtenUploadChunk(
  input: unknown,
  ctx: DemoContext,
): Promise<unknown> {
  const uploadId = field(input, "uploadId");
  const computer = field(input, "computer");
  const offset = field(input, "offset");
  const content = decodeBase64(field(input, "data"));
  if (!isInt(uploadId) || !isNonEmptyString(computer) || !isInt(offset) || content === false) {
    return -61501;
  }

  const upload = await ctx.db.get("written_upload", uploadId);
  if (!upload || upload.computer !== computer || upload.complete !== 0) return -61502;

  const length = content.length;
  if (
    length === 0 ||
    length > WRITTEN_MAX_CHUNK_SIZE ||
    offset < 0 ||
    offset > upload.received ||
    offset + length > upload.size
  ) {
    return -61503;
  }

  const partial = await ctx.db.getContent("written_upload", uploadId);
  await ctx.db.setContent("written_upload", uploadId, writeInBlob(partial, offset, content));
  const received = Math.max(upload.received, offset + length);
  await ctx.db.put("written_upload", { ...upload, received, time: ctx.now() });

  return { received };
}
