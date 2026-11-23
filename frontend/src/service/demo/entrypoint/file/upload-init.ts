import { DemoContext, field, isInt, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import {
  collectFileUploadGarbage,
  FILE_MAX_CHUNK_SIZE,
  FILE_MAX_SIZE,
  findFile,
  isFileNameUsed,
  isReservedFileName,
  sanitizeFileName,
} from "../../lib/file";
import { normalizeMime } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/file/upload-init/index.php`.
 * There is no disk space to check in the browser.
 */
export default async function fileUploadInit(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const fileId = field(input, "fileId");
  const name = sanitizeFileName(field(input, "name"));
  const size = field(input, "size");
  // Exactly one of `classroomCode` and `fileId`.
  if (isNonEmptyString(classroomCode) === isInt(fileId) || name === false || !isInt(size)) {
    return -50801;
  }
  const mime = normalizeMime(field(input, "mime"));
  if (isReservedFileName(name)) return -50806;
  if (size < 0 || size > FILE_MAX_SIZE) return -50808;

  const classroom = await resolveClassroom(ctx, classroomCode, fileId, mime);
  if (classroom < 0) return classroom;
  if (await isFileNameUsed(ctx, classroom, name, isInt(fileId) ? fileId : null)) return -50805;

  await collectFileUploadGarbage(ctx);
  const uploadId = await ctx.db.insert("file_upload", {
    classroom,
    file: isInt(fileId) ? fileId : null,
    name,
    mime,
    size,
    received: 0,
    time: ctx.now(),
  });
  await ctx.db.setContent("file_upload", uploadId, new Blob([]));

  return { uploadId, chunkSize: FILE_MAX_CHUNK_SIZE };
}

/**
 * @returns The ID of the class room of the upload (the one of the replaced file if
 * `fileId` is an integer), or a negative error code.
 */
async function resolveClassroom(
  ctx: DemoContext,
  classroomCode: unknown,
  fileId: unknown,
  mime: string,
): Promise<number> {
  if (isInt(fileId)) {
    const file = await findFile(ctx, fileId);
    if (file === false) return -50803;
    if (file.user !== ctx.user.id) return -50804;
    if (isReservedFileName(file.name)) return -50806;
    if (mime !== file.mime) return -50807;
    return file.classroom;
  }

  const classroom = await findClassByCode(ctx, String(classroomCode));
  if (classroom === false) return -50802;
  if (classroom.user !== ctx.user.id) return -50804;
  return classroom.id;
}
