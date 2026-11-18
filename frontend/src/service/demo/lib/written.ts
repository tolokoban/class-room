import { DemoContext, field, isInt, isNonEmptyString } from "../context";
import {
  ClassRow,
  WrittenAssignmentRow,
  WrittenAttachmentRow,
  WrittenRow,
  WrittenUploadRow,
} from "../db/tables";
import { forgetDemoUrl, registerDemoUrl } from "../urls";
import { ClassInfo, findClassByCode } from "./activity";
import { compareText } from "./class";

/**
 * Translation of `backend/www/api/written.php`.
 *
 * Differences with the backend:
 * - There is no `finfo` in the browser: the mime type is the one declared (or guessed from the name).
 * - The contents are `Blob`s in the demo database, not files.
 */

/** The activity code of a written production is "written/{id}". */
export const WRITTEN_ACTIVITY_PREFIX = "written/";

/** Maximum size (in bytes) of an expected file. */
export const WRITTEN_MAX_FILE_SIZE = 1024 * 1024 * 1024;

/** Maximum size (in bytes) of a decoded chunk. */
export const WRITTEN_MAX_CHUNK_SIZE = 1024 * 1024;

/** Incomplete uploads are deleted after this number of seconds without any new chunk. */
export const WRITTEN_PENDING_TIMEOUT = 3600;

/** Maximum number of expected files for a written production. */
export const WRITTEN_MAX_FILES = 20;

/** Maximum size (in bytes) of a file attached by the teacher. */
export const WRITTEN_MAX_ATTACHMENT_SIZE = 100 * 1024 * 1024;

/** Maximum number of files attached to a written production. */
export const WRITTEN_MAX_ATTACHMENTS = 20;

const WRITTEN_MIME_EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/rtf": "rtf",
  "text/rtf": "rtf",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",
  "text/csv": "csv",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.oasis.opendocument.presentation": "odp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/html": "html",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/x-7z-compressed": "7z",
  "audio/mpeg": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const MIME_PATTERN = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/;
// oxlint-disable-next-line no-control-regex
const FORBIDDEN_CHARS = /[\x00-\x1f\x7f/\\:*?"<>|]/;
// oxlint-disable-next-line no-control-regex
const FORBIDDEN_CHARS_GLOBAL = /[\x00-\x1f\x7f/\\:*?"<>|]+/g;

export interface ExpectedFile {
  name: string;
  mimeTypes: string[];
  maxSize: number;
}

export interface Written {
  id: number;
  user: number;
  name: string;
  description: string;
  duration: number;
  expiration: number;
  files: ExpectedFile[];
}

export interface Assignment {
  id: number;
  written: number;
  classroom: number;
  endTime: number | null;
  remaining: number | null;
  extension: number;
  expiresAt: number | null;
}

export interface Timer {
  state: "idle" | "running" | "paused";
  endTime: number | null;
  remaining: number | null;
  expiresAt: number | null;
}

export interface Resolved {
  class: ClassInfo;
  written: Written;
  assignment: Assignment;
}

/**
 * Check and normalize the list of the expected files of a written production.
 */
export function parseExpectedFiles(files: unknown): ExpectedFile[] | false {
  if (!Array.isArray(files) || files.length === 0 || files.length > WRITTEN_MAX_FILES) return false;

  const result: ExpectedFile[] = [];
  const names = new Set<string>();
  for (const file of files) {
    const isObject = typeof file === "object" && file !== null && !Array.isArray(file);
    const name = isObject ? field(file, "name") : null;
    const mimeTypes = isObject ? (field(file, "mimeTypes") ?? []) : null;
    const maxSize = isObject ? field(file, "maxSize") : null;
    if (typeof name !== "string" || !isValidSlotName(name.trim())) return false;

    const key = name.trim().toLowerCase();
    if (names.has(key)) return false;

    names.add(key);
    if (!Array.isArray(mimeTypes)) return false;

    for (const mime of mimeTypes) {
      if (typeof mime !== "string" || !MIME_PATTERN.test(mime)) return false;
    }
    if (!isInt(maxSize) || maxSize < 1 || maxSize > WRITTEN_MAX_FILE_SIZE) return false;

    result.push({ name: name.trim(), mimeTypes: [...new Set(mimeTypes as string[])], maxSize });
  }
  return result;
}

export interface WrittenInput {
  name: string;
  description: string;
  duration: number;
  expiration: number;
  files: ExpectedFile[];
}

/**
 * Check and normalize the definition of a written production (`written/add` and `written/update`).
 */
export function parseWrittenInput(input: unknown): WrittenInput | false {
  const name = field(input, "name");
  const description = field(input, "description") ?? "";
  const duration = field(input, "duration");
  const expiration = field(input, "expiration") ?? 24;
  const files = parseExpectedFiles(field(input, "files"));
  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    [...name.trim()].length > 255 ||
    typeof description !== "string" ||
    !isInt(duration) ||
    duration < 1 ||
    duration > 24 * 60 ||
    !isInt(expiration) ||
    expiration < 1 ||
    expiration > 24 * 365 ||
    files === false
  ) {
    return false;
  }
  return { name: name.trim(), description, duration, expiration, files };
}

/**
 * The name of an expected file is part of the name of the downloaded files.
 */
export function isValidSlotName(name: string): boolean {
  return (
    name !== "" && [...name].length <= 64 && !name.startsWith(".") && !FORBIDDEN_CHARS.test(name)
  );
}

export function formatWritten(row: WrittenRow): Written {
  let files: ExpectedFile[] = [];
  try {
    files = (JSON.parse(row.files) as ExpectedFile[] | null) ?? [];
  } catch {
    files = [];
  }
  return {
    id: row.id,
    user: row.user,
    name: row.name,
    description: row.description,
    duration: row.duration,
    expiration: row.expiration,
    files,
  };
}

export async function findWritten(ctx: DemoContext, id: number): Promise<Written | false> {
  const row = await ctx.db.get("written", id);
  return row ? formatWritten(row) : false;
}

export function formatAssignment(row: WrittenAssignmentRow): Assignment {
  return {
    id: row.id,
    written: row.written,
    classroom: row.classroom,
    endTime: row.end_time,
    remaining: row.remaining,
    extension: row.extension,
    expiresAt: row.expires_at,
  };
}

export async function findAssignment(
  ctx: DemoContext,
  writtenId: number,
  classroomId: number,
): Promise<Assignment | false> {
  const row = await ctx.db.findOne(
    "written_assignment",
    (item) => item.written === writtenId && item.classroom === classroomId,
  );
  return row ? formatAssignment(row) : false;
}

export function getTimer(assignment: Assignment): Timer {
  const state =
    assignment.endTime !== null ? "running" : assignment.remaining !== null ? "paused" : "idle";
  return {
    state,
    endTime: assignment.endTime,
    remaining: assignment.remaining,
    expiresAt: assignment.expiresAt,
  };
}

export function computeExpiresAt(
  endTime: number,
  written: Written,
  assignment: Assignment,
): number {
  return endTime + 3600 * (written.expiration + assignment.extension);
}

/**
 * @returns `true`, or the reason why it is not possible to upload: "idle" or "expired".
 */
export function canUpload(ctx: DemoContext, assignment: Assignment): true | "idle" | "expired" {
  const timer = getTimer(assignment);
  if (timer.state === "idle") return "idle";
  if (timer.expiresAt !== null && timer.expiresAt <= ctx.now()) return "expired";
  return true;
}

export async function findSeat(ctx: DemoContext, classroomId: number, computer: string) {
  const row = await ctx.db.get("seat", [classroomId, computer]);
  return row ? { computer: row.computer, nickname: row.nickname } : false;
}

async function findOwnedClass(
  ctx: DemoContext,
  classroomCode: string,
): Promise<ClassInfo | "missing" | "forbidden"> {
  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return "missing";
  if (found.user !== ctx.user.id) return "forbidden";
  return found;
}

async function findOwnedWritten(
  ctx: DemoContext,
  writtenId: number,
): Promise<Written | "missing" | "forbidden"> {
  const written = await findWritten(ctx, writtenId);
  if (written === false) return "missing";
  if (written.user !== ctx.user.id) return "forbidden";
  return written;
}

/**
 * Error codes: `-(base + 1)` invalid input, `-(base + 2)` missing, `-(base + 3)` forbidden.
 */
export async function resolveOwnedClass(
  ctx: DemoContext,
  classroomCode: unknown,
  base: number,
): Promise<ClassInfo | number> {
  if (!isNonEmptyString(classroomCode)) return -(base + 1);

  const found = await findOwnedClass(ctx, classroomCode);
  if (found === "missing") return -(base + 2);
  if (found === "forbidden") return -(base + 3);
  return found;
}

/**
 * Error codes: `-(base + 1)` invalid input, `-(base + 2)` missing, `-(base + 3)` forbidden.
 */
export async function resolveOwnedWritten(
  ctx: DemoContext,
  writtenId: unknown,
  base: number,
): Promise<Written | number> {
  if (!isInt(writtenId)) return -(base + 1);

  const written = await findOwnedWritten(ctx, writtenId);
  if (written === "missing") return -(base + 2);
  if (written === "forbidden") return -(base + 3);
  return written;
}

/**
 * Error codes: `-(base + n)` with n = 1 invalid input, 2 no class room, 3 not the owner of the
 * class room, 4 no written production, 5 not the owner of it, 6 not assigned to this class room.
 */
export async function resolveAssignment(
  ctx: DemoContext,
  writtenId: unknown,
  classroomCode: unknown,
  base: number,
): Promise<Resolved | number> {
  const found = await resolveOwnedClass(ctx, classroomCode, base);
  if (typeof found === "number") return found;
  if (!isInt(writtenId)) return -(base + 1);

  const written = await findOwnedWritten(ctx, writtenId);
  if (written === "missing") return -(base + 4);
  if (written === "forbidden") return -(base + 5);

  const assignment = await findAssignment(ctx, written.id, found.id);
  if (assignment === false) return -(base + 6);
  return { class: found, written, assignment };
}

/**
 * For a student. Error codes: `-(base + n)` with n = 1 invalid input, 2 no class room,
 * 3 this written production does not exist or is not assigned to this class room.
 */
export async function resolvePublicAssignment(
  ctx: DemoContext,
  writtenId: unknown,
  classroomCode: unknown,
  base: number,
): Promise<Resolved | number> {
  if (!isInt(writtenId) || !isNonEmptyString(classroomCode)) return -(base + 1);

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -(base + 2);

  const written = await findWritten(ctx, writtenId);
  const assignment = written === false ? false : await findAssignment(ctx, writtenId, found.id);
  if (written === false || assignment === false) return -(base + 3);
  return { class: found, written, assignment };
}

export interface Upload {
  id: number;
  computer: string;
  nickname: string;
  slot: string;
  original: string;
  mime: string;
  ext: string;
  size: number;
  late: boolean;
  time: number;
}

export function getPublicUpload(upload: Upload) {
  return {
    slot: upload.slot,
    original: upload.original,
    mime: upload.mime,
    size: upload.size,
    late: upload.late,
    time: upload.time,
  };
}

/**
 * Format the expected files and the public infos of a written production.
 * The links to the attachments are registered for the demo mode
 * (with the class room code, if given, for the students' variant of the URL).
 */
export async function getWrittenInfos(ctx: DemoContext, written: Written, classroomCode?: string) {
  return {
    id: written.id,
    name: written.name,
    description: written.description,
    duration: written.duration,
    expiration: written.expiration,
    files: written.files,
    attachments: await listAttachments(ctx, written.id, classroomCode),
  };
}

export function isClassOwner(ctx: DemoContext, classInfo: ClassInfo): boolean {
  return classInfo.user === ctx.user.id;
}

/**
 * The complete attachments of a written production, sorted by name.
 * Their download URLs are registered for the demo mode.
 */
export async function listAttachments(ctx: DemoContext, writtenId: number, classroomCode?: string) {
  const rows = await ctx.db.where(
    "written_attachment",
    (row) => row.written === writtenId && row.complete === 1,
  );
  rows.sort((a, b) => compareText(a.name, b.name));
  for (const row of rows) await registerAttachmentUrls(ctx, row, classroomCode);
  return rows.map((row) => ({ id: row.id, name: row.name, mime: row.mime, size: row.size }));
}

/** URL of `getWrittenAttachmentUrl()` in `calls/written.ts`. */
export function getAttachmentApiUrl(attachmentId: number, classroomCode?: string): string {
  const url = `api/written/attachment-get?attachmentId=${attachmentId}`;
  return classroomCode ? `${url}&classroomCode=${encodeURIComponent(classroomCode)}` : url;
}

/** URL of `getWrittenUploadUrl()` in `calls/written.ts`. */
export function getUploadApiUrl(uploadId: number): string {
  return `api/written/download?uploadId=${uploadId}`;
}

/** URL of `getWrittenZipUrl()` in `calls/written.ts`. */
export function getZipApiUrl(writtenId: number, classroomCode: string): string {
  return `api/written/zip?writtenId=${writtenId}&classroomCode=${encodeURIComponent(classroomCode)}`;
}

export async function registerAttachmentUrls(
  ctx: DemoContext,
  row: WrittenAttachmentRow,
  classroomCode?: string,
) {
  const content = await ctx.db.getContent("written_attachment", row.id);
  if (!content) return;

  const blob = new Blob([content], { type: row.mime });
  registerDemoUrl(getAttachmentApiUrl(row.id), blob);
  if (classroomCode) registerDemoUrl(getAttachmentApiUrl(row.id, classroomCode), blob);
}

export async function findAttachment(ctx: DemoContext, id: number) {
  const row = await ctx.db.get("written_attachment", id);
  if (!row) return false;

  const written = await ctx.db.get("written", row.written);
  if (!written) return false;

  return { ...row, owner: written.user, isComplete: row.complete === 1 };
}

export async function findOwnedAttachment(ctx: DemoContext, id: number) {
  const attachment = await findAttachment(ctx, id);
  if (attachment === false) return "missing";
  if (attachment.owner !== ctx.user.id) return "forbidden";
  return attachment;
}

/**
 * Delete the attachments matching `predicate` (rows and contents).
 * @returns Number of deleted attachments.
 */
export async function deleteAttachments(
  ctx: DemoContext,
  predicate: (row: WrittenAttachmentRow) => boolean,
): Promise<number> {
  const rows = await ctx.db.where("written_attachment", predicate);
  if (rows.length === 0) return 0;

  const classes = await ctx.db.all("class");
  for (const row of rows) {
    await ctx.db.delete("written_attachment", row.id);
    forgetDemoUrl(getAttachmentApiUrl(row.id));
    for (const item of classes) forgetDemoUrl(getAttachmentApiUrl(row.id, item.code));
  }
  return rows.length;
}

/**
 * The browsers do not always know the mime type of a file (Markdown for instance).
 */
export function guessAttachmentMime(declaredMime: string, name: string): string {
  return guessMime(declaredMime, name, { name: "", mimeTypes: [], maxSize: 0 });
}

/**
 * Delete the uploads matching `predicate` (rows and contents).
 * @returns Number of deleted uploads.
 */
export async function deleteUploads(
  ctx: DemoContext,
  predicate: (upload: WrittenUploadRow, assignment: WrittenAssignmentRow) => boolean,
): Promise<number> {
  const assignments = new Map((await ctx.db.all("written_assignment")).map((row) => [row.id, row]));
  const rows = await ctx.db.where("written_upload", (upload) => {
    const assignment = assignments.get(upload.assignment);
    return assignment !== undefined && predicate(upload, assignment);
  });
  for (const row of rows) {
    await ctx.db.delete("written_upload", row.id);
    forgetDemoUrl(getUploadApiUrl(row.id));
  }
  return rows.length;
}

/**
 * Delete the expired uploads, and the incomplete ones that have been abandoned.
 */
export async function collectWrittenGarbage(ctx: DemoContext): Promise<void> {
  const now = ctx.now();
  await deleteUploads(
    ctx,
    (u, a) =>
      (a.expires_at !== null && a.expires_at <= now) ||
      (u.complete === 0 && u.time < now - WRITTEN_PENDING_TIMEOUT),
  );
  await deleteAttachments(
    ctx,
    (row) => row.complete === 0 && row.time < now - WRITTEN_PENDING_TIMEOUT,
  );
}

/**
 * Short and public identifier of a computer (6 first hex digits of its SHA-256).
 */
export async function getComputerHash(computer: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(computer));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 6);
}

/**
 * Name of an uploaded file when downloaded by the teacher: `{nickname}.{name}.{hash}.{ext}`.
 */
export async function getUploadDownloadName(
  nickname: string,
  slot: string,
  computer: string,
  ext: string,
): Promise<string> {
  let name = nickname.replace(FORBIDDEN_CHARS_GLOBAL, "_").trim();
  if (name === "" || name.startsWith(".")) name = `_${name}`;
  return `${name}.${slot}.${await getComputerHash(computer)}.${ext}`;
}

/** Translation of `getFileExtension()` in `file.php`. */
export function getFileExtension(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "";
  const index = base.lastIndexOf(".");
  const extension =
    index < 0
      ? ""
      : base
          .slice(index + 1)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "");
  return extension === "" ? "bin" : extension.slice(0, 16);
}

/** Translation of `sanitizeFileName()` in `file.php`. */
export function sanitizeFileName(name: unknown): string | false {
  if (typeof name !== "string") return false;

  const cleaned = (name.split(/[/\\]/).pop() ?? "").trim();
  if (
    cleaned === "" ||
    cleaned === "." ||
    cleaned === ".." ||
    [...cleaned].length > 255 ||
    // oxlint-disable-next-line no-control-regex
    /[\x00-\x1f\x7f]/.test(cleaned)
  ) {
    return false;
  }
  return cleaned;
}

export function getUploadExtension(mime: string, originalName: string): string {
  return WRITTEN_MIME_EXTENSIONS[mime] ?? getFileExtension(originalName);
}

export function normalizeMime(mime: unknown): string {
  const value = typeof mime === "string" ? mime.trim().toLowerCase() : "";
  return MIME_PATTERN.test(value) ? value : "application/octet-stream";
}

export function guessMime(declaredMime: string, name: string, expectedFile: ExpectedFile): string {
  if (declaredMime !== "application/octet-stream" && isMimeAccepted(declaredMime, expectedFile)) {
    return declaredMime;
  }
  let ext = getFileExtension(name);
  if (ext === "jpeg") ext = "jpg";
  const guessed = Object.keys(WRITTEN_MIME_EXTENSIONS).find(
    (mime) => WRITTEN_MIME_EXTENSIONS[mime] === ext,
  );
  return guessed ?? declaredMime;
}

export function isMimeAccepted(mime: string, expectedFile: ExpectedFile): boolean {
  const accepted = expectedFile.mimeTypes;
  return accepted.length === 0 || accepted.includes(mime);
}

export function findExpectedFile(written: Written, slot: string): ExpectedFile | false {
  return written.files.find((file) => file.name === slot) ?? false;
}

/**
 * List the complete uploads of an assignment, sorted by nickname and slot.
 * @param computer If not `null`, only the uploads of this computer.
 */
export async function listUploads(
  ctx: DemoContext,
  assignmentId: number,
  computer: string | null = null,
): Promise<Upload[]> {
  const rows = await ctx.db.where(
    "written_upload",
    (row) =>
      row.assignment === assignmentId &&
      row.complete === 1 &&
      (computer === null || row.computer === computer),
  );
  rows.sort((a, b) => compareText(a.nickname, b.nickname) || compareText(a.slot, b.slot));
  return rows.map((row) => ({
    id: row.id,
    computer: row.computer,
    nickname: row.nickname,
    slot: row.slot,
    original: row.original,
    mime: row.mime,
    ext: row.ext,
    size: row.size,
    late: row.late === 1,
    time: row.time,
  }));
}

/**
 * `base64_decode($data, true)`: `false` if `data` is not valid base64.
 */
export function decodeBase64(data: unknown): Uint8Array | false {
  if (typeof data !== "string") return false;

  try {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return false;
  }
}

/**
 * Write `content` at `offset` in `blob`, like `fopen($path, "c")` + `fseek()` + `fwrite()`.
 */
export function writeInBlob(blob: Blob | undefined, offset: number, content: Uint8Array): Blob {
  const current = blob ?? new Blob([]);
  return new Blob([
    current.slice(0, offset),
    content as Uint8Array<ArrayBuffer>,
    current.slice(offset + content.length),
  ]);
}

/** `UPDATE class SET activity = NULL WHERE ... AND activity = 'written/{id}'`. */
export async function clearWrittenActivity(
  ctx: DemoContext,
  writtenId: number,
  predicate: (row: ClassRow) => boolean,
): Promise<void> {
  const code = `${WRITTEN_ACTIVITY_PREFIX}${writtenId}`;
  const rows = await ctx.db.where("class", (row) => predicate(row) && row.activity === code);
  for (const row of rows) await ctx.db.put("class", { ...row, activity: null });
}
