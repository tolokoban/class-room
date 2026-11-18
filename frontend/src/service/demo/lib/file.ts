import { DemoContext } from "../context";
import { FilesRow } from "../db/tables";
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

export interface DataUrl {
  mime: string;
  content: Blob;
}

/**
 * Decode a data URL (`data:<mime>;base64,<content>`), as produced
 * by `FileReader.readAsDataURL()` in the browser.
 * @returns `false` if this is not a valid base64 data URL.
 */
export function parseDataUrl(file: unknown): DataUrl | false {
  if (typeof file !== "string") return false;

  const matches = /^data:([^;,]*)((?:;[^;,]*)*),/.exec(file);
  if (!matches) return false;

  const params = matches[2]
    .toLowerCase()
    .split(";")
    .map((param) => param.trim());
  if (!params.includes("base64")) return false;

  const base64 = file.slice(matches[0].length).replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) return false;

  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    return false;
  }
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  let mime = matches[1].trim().toLowerCase();
  if (!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/.test(mime)) {
    mime = "application/octet-stream";
  }
  return { mime, content: new Blob([bytes], { type: mime }) };
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
