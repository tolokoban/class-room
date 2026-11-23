import { DemoContext } from "../context";
import { FilesRow, FileUploadRow } from "../db/tables";
import { registerDemoUrl } from "../urls";
import { sameText } from "./class";

/**
 * Translation of `backend/www/api/file.php`.
 */

/**
 * The Markdown notes of a class room are stored as a file with this name.
 * The teacher cannot upload a file with this name, and it is not listed by `file/list`.
 */
export const NOTES_FILE_NAME = "notes.md";
export const NOTES_MIME = "text/markdown";

/** Maximum size (in bytes) of a file. */
export const FILE_MAX_SIZE = 100 * 1024 * 1024;

/** Maximum size (in bytes) of a decoded chunk. */
export const FILE_MAX_CHUNK_SIZE = 1024 * 1024;

/** Incomplete uploads are deleted after this number of seconds without any new chunk. */
export const FILE_UPLOAD_TIMEOUT = 3600;

/** Is this name reserved (case insensitive, like the database collation)? */
export function isReservedFileName(name: string): boolean {
  return name.toLowerCase() === NOTES_FILE_NAME;
}

/** @returns The notes file of a class room, or `false` if there is none yet. */
export async function findNotesFile(
  ctx: DemoContext,
  classroom: number,
): Promise<FilesRow | false> {
  const row = await ctx.db.findOne(
    "files",
    (item) => item.classroom === classroom && sameText(item.name, NOTES_FILE_NAME),
  );
  return row ?? false;
}

/**
 * Remove any folder from a file name and check it is valid.
 * @returns The cleaned name, or `false` if it is invalid.
 */
export function sanitizeFileName(value: unknown): string | false {
  if (typeof value !== "string") return false;

  const parts = value.split(/[/\\]/);
  const name = (parts[parts.length - 1] ?? "").trim();
  if (
    name === "" ||
    name === "." ||
    name === ".." ||
    [...name].length > 255 ||
    // oxlint-disable-next-line no-control-regex
    /[\x00-\x1f\x7f]/.test(name)
  ) {
    return false;
  }
  return name;
}

export interface FileInfo extends FilesRow {
  /** Owner of the class room. */
  user: number;
}

/** @returns The file and the owner of its class room, or `false` if there is no file with this ID. */
export async function findFile(ctx: DemoContext, id: number): Promise<FileInfo | false> {
  const file = await ctx.db.get("files", id);
  if (!file) return false;

  const classroom = await ctx.db.get("class", file.classroom);
  if (!classroom) return false;

  return { ...file, user: classroom.user };
}

/**
 * Is there a file with this name in this class room?
 * @param exceptId ID of a file to ignore (the one being replaced).
 */
export async function isFileNameUsed(
  ctx: DemoContext,
  classroom: number,
  name: string,
  exceptId: number | null = null,
): Promise<boolean> {
  const row = await ctx.db.findOne(
    "files",
    (item) =>
      item.classroom === classroom && sameText(item.name, name) && item.id !== (exceptId ?? 0),
  );
  return row !== undefined;
}

/** URL of the link to a file (see `getFileUrl()` in `service/calls/file.ts`). */
export function getFileApiUrl(fileId: number): string {
  return `api/file/get?fileId=${fileId}`;
}

/** Make the link to a file work in demo mode. */
export function registerFileUrl(fileId: number, blob: Blob, mime: string) {
  registerDemoUrl(
    getFileApiUrl(fileId),
    blob.type === mime ? blob : new Blob([blob], { type: mime }),
  );
}

/**
 * @returns An upload in progress, if it belongs to a class room of the current user,
 * or `false` otherwise.
 */
export async function findOwnedFileUpload(
  ctx: DemoContext,
  id: number,
): Promise<FileUploadRow | false> {
  const upload = await ctx.db.get("file_upload", id);
  if (!upload) return false;

  const classroom = await ctx.db.get("class", upload.classroom);
  return classroom?.user === ctx.user.id ? upload : false;
}

/**
 * Delete the uploads in progress that have not received any chunk
 * for `FILE_UPLOAD_TIMEOUT` seconds (rows and content).
 */
export async function collectFileUploadGarbage(ctx: DemoContext): Promise<void> {
  const limit = ctx.now() - FILE_UPLOAD_TIMEOUT;
  await ctx.db.deleteWhere("file_upload", (row) => row.time < limit);
}
