import { isType$, TypeDef } from "@tolokoban/type-guards";

import { resolveApiUrl } from "@/service/demo/links";

import { sendChunks } from "./chunks";
import { api, ApiErrorTypeAssertion, throwIfError } from "./service";

/**
 * Generic activities of type "Production écrite" (written productions).
 * See `backend/www/api/written.php`.
 */

/** The activity code of a written production is "written/{id}". */
export const WRITTEN_ACTIVITY_PREFIX = "written/";

export function getWrittenActivityCode(writtenId: number): string {
  return `${WRITTEN_ACTIVITY_PREFIX}${writtenId}`;
}

/** @returns The ID of the written production, or `null` if this is not a written production. */
export function parseWrittenActivityCode(code: string | null | undefined): number | null {
  if (!code?.startsWith(WRITTEN_ACTIVITY_PREFIX)) return null;

  const id = Number(code.slice(WRITTEN_ACTIVITY_PREFIX.length));
  return Number.isInteger(id) ? id : null;
}

export interface WrittenExpectedFile {
  /** Part of the name of the downloaded files: `{nickname}.{name}.{hash}.{ext}`. */
  name: string;
  /** Accepted mime types. An empty array accepts any type. */
  mimeTypes: string[];
  /** Max size in bytes. */
  maxSize: number;
}

export interface WrittenDefinition {
  name: string;
  /** Markdown. */
  description: string;
  /** Minutes. */
  duration: number;
  /** Hours after the end of the exercise before the deletion of the files. */
  expiration: number;
  files: WrittenExpectedFile[];
}

/** A file attached by the teacher, that the students can download. */
export interface WrittenAttachment {
  id: number;
  /** Name of the file, with its extension. */
  name: string;
  mime: string;
  /** Size in bytes. */
  size: number;
}

export interface WrittenItem extends WrittenDefinition {
  id: number;
  attachments: WrittenAttachment[];
  /** Codes of the class rooms this production is assigned to. */
  classrooms: string[];
  /** Number of uploaded files for each expected file. */
  uploads: Record<string, number>;
}

export interface WrittenTimer {
  state: "idle" | "running" | "paused";
  /** UNIX timestamp (seconds) of the end of the exercise, if running. */
  endTime: number | null;
  /** Seconds left (can be negative), if paused. */
  remaining: number | null;
  /** UNIX timestamp (seconds) of the deletion of the files. */
  expiresAt: number | null;
}

export interface WrittenClassroomItem {
  id: number;
  name: string;
  timer: WrittenTimer;
  /** Number of uploaded files. */
  count: number;
  /** Total size of the uploaded files, in bytes. */
  size: number;
}

export interface WrittenClassroom {
  /** Current UNIX timestamp of the server (seconds). */
  now: number;
  items: WrittenClassroomItem[];
}

export interface WrittenStudentUpload {
  /** Name of the expected file. */
  slot: string;
  /** Name of the file on the student's computer. */
  original: string;
  mime: string;
  size: number;
  /** Uploaded after the end of the timer. */
  late: boolean;
  /** UNIX timestamp (seconds). */
  time: number;
}

export interface WrittenTeacherUpload extends WrittenStudentUpload {
  id: number;
  nickname: string;
  /** Short public identifier of the computer of the student. */
  hash: string;
  /** `{nickname}.{slot}.{hash}.{ext}` */
  downloadName: string;
}

export interface WrittenResults extends WrittenDefinition {
  id: number;
  attachments: WrittenAttachment[];
  now: number;
  timer: WrittenTimer;
  uploads: WrittenTeacherUpload[];
}

export interface WrittenState extends WrittenDefinition {
  id: number;
  attachments: WrittenAttachment[];
  now: number;
  /** `true` for the owner of the class room. */
  preview: boolean;
  /** Does this computer have a seat in the class room? */
  seated: boolean;
  timer: WrittenTimer;
  uploads: WrittenStudentUpload[];
}

export type WrittenTimerAction = "start" | "pause" | "resume" | "add" | "extend" | "reset";

export interface WrittenRef {
  writtenId: number;
  /** Field `code` of table `class`. */
  classroomCode: string;
}

const EXPECTED_FILE: TypeDef = {
  name: "string",
  mimeTypes: ["array", "string"],
  maxSize: "number",
};
const DEFINITION: Record<string, TypeDef> = {
  name: "string",
  description: "string",
  duration: "number",
  expiration: "number",
  files: ["array", EXPECTED_FILE],
};
const ATTACHMENT: TypeDef = {
  id: "number",
  name: "string",
  mime: "string",
  size: "number",
};
const TIMER: TypeDef = {
  state: ["literal", "idle", "running", "paused"],
  endTime: ["|", "null", "number"],
  remaining: ["|", "null", "number"],
  expiresAt: ["|", "null", "number"],
};
const STUDENT_UPLOAD: Record<string, TypeDef> = {
  slot: "string",
  original: "string",
  mime: "string",
  size: "number",
  late: "boolean",
  time: "number",
};

/**
 * Call an entrypoint, throw an `ApiError` if it returns an error code,
 * and check the type of the response.
 * The messages of the errors are translated by `useApiError()`.
 */
async function call<T>(entrypoint: string, input: unknown, type: TypeDef): Promise<T> {
  const result = await api(entrypoint, input);
  throwIfError(result, {});
  if (!isType$<T>(result, type)) {
    throw new ApiErrorTypeAssertion(`Invalid response for "${entrypoint}"`);
  }
  return result;
}

export function writtenList(): Promise<WrittenItem[]> {
  return call("written/list", null, [
    "array",
    {
      ...DEFINITION,
      id: "number",
      attachments: ["array", ATTACHMENT],
      classrooms: ["array", "string"],
      uploads: ["map", "number"],
    },
  ]);
}

/** @returns The ID of the new written production. */
export function writtenAdd(input: WrittenDefinition): Promise<number> {
  return call("written/add", input, "number");
}

/** @returns The number of uploaded files deleted because their expected file has been removed. */
export async function writtenUpdate(input: WrittenDefinition & { id: number }): Promise<number> {
  const result = await call<{ deleted: number }>("written/update", input, { deleted: "number" });
  return result.deleted;
}

export async function writtenDelete(input: { id: number }): Promise<void> {
  await call("written/delete", input, "number");
}

export async function writtenAssign(input: WrittenRef): Promise<void> {
  await call("written/assign", input, "number");
}

/** @returns The number of deleted files. */
export function writtenUnassign(input: WrittenRef): Promise<number> {
  return call("written/unassign", input, "number");
}

/** Change the order of the written productions assigned to a class room. */
export async function writtenReorder(input: {
  classroomCode: string;
  /** IDs of all the written productions assigned to the class room, in the new order. */
  writtenIds: number[];
}): Promise<void> {
  await call("written/reorder", input, "number");
}

export function writtenClassroom(input: { classroomCode: string }): Promise<WrittenClassroom> {
  return call("written/classroom", input, {
    now: "number",
    items: [
      "array",
      { id: "number", name: "string", timer: TIMER, count: "number", size: "number" },
    ],
  });
}

export function writtenTimer(
  input: WrittenRef & { action: WrittenTimerAction; value?: number },
): Promise<WrittenTimer> {
  return call("written/timer", input, TIMER);
}

export function writtenResults(input: WrittenRef): Promise<WrittenResults> {
  return call("written/results", input, {
    ...DEFINITION,
    id: "number",
    attachments: ["array", ATTACHMENT],
    now: "number",
    timer: TIMER,
    uploads: [
      "array",
      {
        ...STUDENT_UPLOAD,
        id: "number",
        nickname: "string",
        hash: "string",
        downloadName: "string",
      },
    ],
  });
}

/**
 * Delete the files uploaded for a written production of a class room,
 * or for all the written productions of a class room if `writtenId` is missing.
 * @returns The number of deleted files.
 */
export function writtenFilesDelete(input: {
  classroomCode: string;
  writtenId?: number;
}): Promise<number> {
  return call("written/files-delete", input, "number");
}

export function writtenState(input: WrittenRef & { computer?: string }): Promise<WrittenState> {
  return call("written/state", input, {
    ...DEFINITION,
    id: "number",
    attachments: ["array", ATTACHMENT],
    now: "number",
    preview: "boolean",
    seated: "boolean",
    timer: TIMER,
    uploads: ["array", STUDENT_UPLOAD],
  });
}

export async function writtenUploadDelete(
  input: WrittenRef & { computer: string; slot: string },
): Promise<void> {
  await call("written/upload-delete", input, "number");
}

export interface WrittenUploadInput extends WrittenRef {
  computer: string;
  /** Name of the expected file. */
  slot: string;
  file: File;
  /** Called after each chunk with a value between 0 and 1. */
  onProgress?(progress: number): void;
  /** Abort the upload. */
  signal?: AbortSignal;
}

/**
 * Upload a file by chunks: `written/upload-init`, `written/upload-chunk` (as many as needed)
 * and `written/upload-complete`.
 */
export async function writtenUpload({
  file,
  onProgress,
  signal,
  computer,
  ...ref
}: WrittenUploadInput): Promise<WrittenStudentUpload> {
  const init = await call<{ uploadId: number; chunkSize: number }>(
    "written/upload-init",
    { ...ref, computer, name: file.name, size: file.size, mime: file.type },
    { uploadId: "number", chunkSize: "number" },
  );
  const { uploadId, chunkSize } = init;
  await sendChunks({ file, chunkSize, onProgress, signal }, (offset, data) =>
    call("written/upload-chunk", { uploadId, computer, offset, data }, { received: "number" }),
  );
  return call("written/upload-complete", { uploadId, computer }, STUDENT_UPLOAD);
}

export interface WrittenAttachmentUploadInput {
  writtenId: number;
  file: File;
  /** Called after each chunk with a value between 0 and 1. */
  onProgress?(progress: number): void;
  /** Abort the upload. */
  signal?: AbortSignal;
}

/** Maximum size (in bytes) of a file attached by the teacher. */
export const WRITTEN_MAX_ATTACHMENT_SIZE = 100 * 1024 * 1024;

/** Maximum number of files attached to a written production. */
export const WRITTEN_MAX_ATTACHMENTS = 20;

/**
 * Attach a file to a written production, by chunks: `written/attachment-init`,
 * `written/attachment-chunk` (as many as needed) and `written/attachment-complete`.
 * An attachment with the same name is replaced.
 */
export async function writtenAttachmentUpload({
  writtenId,
  file,
  onProgress,
  signal,
}: WrittenAttachmentUploadInput): Promise<WrittenAttachment> {
  const init = await call<{ attachmentId: number; chunkSize: number }>(
    "written/attachment-init",
    { writtenId, name: file.name, size: file.size, mime: file.type },
    { attachmentId: "number", chunkSize: "number" },
  );
  const { attachmentId, chunkSize } = init;
  await sendChunks({ file, chunkSize, onProgress, signal }, (offset, data) =>
    call("written/attachment-chunk", { attachmentId, offset, data }, { received: "number" }),
  );
  return call("written/attachment-complete", { attachmentId }, ATTACHMENT);
}

export async function writtenAttachmentDelete(input: { attachmentId: number }): Promise<void> {
  await call("written/attachment-delete", input, "number");
}

/** URL to open (or download) a file uploaded by a student. */
export function getWrittenUploadUrl(uploadId: number): string {
  return resolveApiUrl(`api/written/download?uploadId=${uploadId}`);
}

/**
 * @returns The content of a file uploaded by a student, decoded as UTF-8 text.
 */
export async function writtenUploadContent(uploadId: number): Promise<string> {
  const response = await fetch(getWrittenUploadUrl(uploadId), { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Unable to load file #${uploadId}: HTTP ${response.status}`);

  return response.text();
}

/** URL to download all the files of a written production of a class room as a ZIP archive. */
export function getWrittenZipUrl({ writtenId, classroomCode }: WrittenRef): string {
  return resolveApiUrl(
    `api/written/zip?writtenId=${writtenId}&classroomCode=${encodeURIComponent(classroomCode)}`,
  );
}

/**
 * URL to download a file attached to a written production.
 * `classroomCode` is needed for the students (the owner of the written production does not need it).
 */
export function getWrittenAttachmentUrl(attachmentId: number, classroomCode?: string): string {
  const url = `api/written/attachment-get?attachmentId=${attachmentId}`;
  return resolveApiUrl(
    classroomCode ? `${url}&classroomCode=${encodeURIComponent(classroomCode)}` : url,
  );
}

/** In the Markdown description, `[text](attachment:name.ext)` links to an attached file. */
export const WRITTEN_ATTACHMENT_PROTOCOL = "attachment:";

/**
 * @returns The Markdown link to an attached file: `[name](attachment:name)`.
 */
export function getWrittenAttachmentLink(name: string): string {
  const label = name.replace(/[[\]\\]/g, (char) => `\\${char}`);
  return `[${label}](${WRITTEN_ATTACHMENT_PROTOCOL}${encodeURIComponent(name)})`;
}

/**
 * @returns A function that turns `attachment:{name}` URLs into the download URL of the attached file,
 * or `undefined` for any other URL. Meant for the `resolveUrl` property of `<Md />`.
 */
export function makeWrittenAttachmentResolver(
  attachments: WrittenAttachment[],
  classroomCode?: string,
): (url: string) => string | undefined {
  return (url: string) => {
    if (!url.toLowerCase().startsWith(WRITTEN_ATTACHMENT_PROTOCOL)) return undefined;

    const name = safeDecodeURIComponent(url.slice(WRITTEN_ATTACHMENT_PROTOCOL.length)).trim();
    const attachment =
      attachments.find((item) => item.name === name) ??
      attachments.find((item) => item.name.toLowerCase() === name.toLowerCase());
    if (!attachment) return "";

    // An absolute URL opens in a new tab (see `<Md />`): the student does not leave the exercise.
    return new URL(getWrittenAttachmentUrl(attachment.id, classroomCode), document.baseURI).href;
  };
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
