import { isString, isType } from "@tolokoban/type-guards";

import { resolveApiUrl } from "@/service/demo/links";

import { sendChunks } from "./chunks";
import { api, ApiError, ApiErrorTypeAssertion, throwIfError } from "./service";

/**
 * The Markdown notes of a class room are stored as a file with this name.
 * It is reserved: the teacher cannot upload a file with this name,
 * and it is not part of `fileList()`.
 */
export const NOTES_FILE_NAME = "notes.md";

/** Same comparison as the backend (case insensitive). */
export function isReservedFileName(name: string): boolean {
  return name.toLowerCase() === NOTES_FILE_NAME;
}

export interface FileItem {
  /** Field `id` of table `files`. */
  id: number;
  /** Name of the file, with its extension. */
  name: string;
  /** Size in bytes. */
  size: number;
  mime: string;
}

export interface FileListInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
}

/**
 * List the files of a class room of the current teacher, sorted by name.
 */
export async function fileList(input: FileListInput): Promise<FileItem[]> {
  const result = await api("file/list", input);
  throwIfError(result, {
    [ApiError.FILE_LIST_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_LIST_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.FILE_LIST_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
  });
  if (
    !isType(result, ["array", { id: "number", name: "string", size: "number", mime: "string" }])
  ) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/list"');
  }
  return result;
}

/** Maximum size (in bytes) of a file (see `FILE_MAX_SIZE` in `backend/www/api/file.php`). */
export const FILE_MAX_SIZE = 100 * 1024 * 1024;

/** Add a new file in a class room. */
export interface FileUploadNew {
  /** Field `code` of table `class`. */
  classroomCode: string;
}

/** Replace the content and the name of a file. The new content must have the same mime type. */
export interface FileUploadReplace {
  /** Field `id` of table `files`. */
  fileId: number;
}

export type FileUploadInput = (FileUploadNew | FileUploadReplace) & {
  /** Its name must be unique in the class room. */
  file: File;
  /** Called after each chunk with a value between 0 and 1. */
  onProgress?(progress: number): void;
  /** Abort the upload. */
  signal?: AbortSignal;
};

/**
 * Upload a file in a class room of the current teacher, by chunks: `file/upload-init`,
 * `file/upload-chunk` (as many as needed) and `file/upload-complete`.
 * With `fileId`, the file replaces an existing one (which keeps its ID).
 * @returns The ID of the file.
 */
export async function fileUpload({
  file,
  onProgress,
  signal,
  ...target
}: FileUploadInput): Promise<number> {
  const init = await api("file/upload-init", {
    ...target,
    name: file.name,
    size: file.size,
    mime: getFileMime(file),
  });
  throwIfError(init, {
    [ApiError.FILE_UPLOAD_INIT_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_UPLOAD_INIT_CLASS_NOT_FOUND]: "This class room does not exist.",
    [ApiError.FILE_UPLOAD_INIT_FILE_NOT_FOUND]: "This file does not exist.",
    [ApiError.FILE_UPLOAD_INIT_FORBIDDEN]: "You are not the owner of this class room.",
    [ApiError.FILE_UPLOAD_INIT_NAME_USED]: `There is already a file called "${file.name}" in this class room.`,
    [ApiError.FILE_UPLOAD_INIT_RESERVED_NAME]: `The name "${file.name}" is reserved.`,
    [ApiError.FILE_UPLOAD_INIT_MIME_MISMATCH]:
      "The new file must have the same type as the replaced one.",
    [ApiError.FILE_UPLOAD_INIT_TOO_LARGE]: "The file is too large.",
    [ApiError.FILE_UPLOAD_INIT_STORAGE_ERROR]: "Unable to store the file on the server.",
    [ApiError.FILE_UPLOAD_INIT_DATABASE_ERROR]: "Database error while adding the file.",
  });
  if (!isType(init, { uploadId: "number", chunkSize: "number" })) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/upload-init"');
  }

  const { uploadId, chunkSize } = init;
  await sendChunks({ file, chunkSize, onProgress, signal }, async (offset, data) => {
    const result = await api("file/upload-chunk", { uploadId, offset, data });
    throwIfError(result, {
      [ApiError.FILE_UPLOAD_CHUNK_INVALID_INPUT]: "Invalid input.",
      [ApiError.FILE_UPLOAD_CHUNK_NOT_FOUND]: "This upload does not exist.",
      [ApiError.FILE_UPLOAD_CHUNK_BAD_CHUNK]: "Invalid chunk.",
      [ApiError.FILE_UPLOAD_CHUNK_STORAGE_ERROR]: "Unable to store the file on the server.",
    });
  });

  const result = await api("file/upload-complete", { uploadId });
  throwIfError(result, {
    [ApiError.FILE_UPLOAD_COMPLETE_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_UPLOAD_COMPLETE_NOT_FOUND]: "This upload does not exist.",
    [ApiError.FILE_UPLOAD_COMPLETE_INCOMPLETE]: "Some parts of the file are missing.",
    [ApiError.FILE_UPLOAD_COMPLETE_NAME_USED]: `There is already a file called "${file.name}" in this class room.`,
    [ApiError.FILE_UPLOAD_COMPLETE_STORAGE_ERROR]: "Unable to store the file on the server.",
    [ApiError.FILE_UPLOAD_COMPLETE_DATABASE_ERROR]: "Database error while adding the file.",
  });
  if (!isType(result, { fileId: "number" })) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/upload-complete"');
  }
  return result.fileId;
}

export interface FileDeleteInput {
  /** Field `id` of table `files`. */
  fileId: number;
}

/**
 * Permanently delete a file.
 */
export async function fileDelete(input: FileDeleteInput): Promise<void> {
  const result = await api("file/delete", input);
  throwIfError(result, {
    [ApiError.FILE_DELETE_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_DELETE_NOT_FOUND]: `There is no file with ID #${input.fileId}.`,
    [ApiError.FILE_DELETE_FORBIDDEN]: `You are not the owner of file #${input.fileId}.`,
    [ApiError.FILE_DELETE_DATABASE_ERROR]: "Database error while deleting the file.",
  });
  if (result !== true) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/delete"');
  }
}

export interface FileNotesGetInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
}

/**
 * @returns The Markdown notes of a class room (`""` if there are none yet).
 */
export async function fileNotesGet(input: FileNotesGetInput): Promise<string> {
  const result = await api("file/notes-get", input);
  throwIfError(result, {
    [ApiError.FILE_NOTES_GET_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_NOTES_GET_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.FILE_NOTES_GET_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
    [ApiError.FILE_NOTES_GET_CONTENT_MISSING]: "The content of the notes is missing on the server.",
  });
  if (!isString(result)) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/notes-get"');
  }
  return result;
}

export interface FileNotesSetInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** Markdown. */
  content: string;
}

/**
 * Save the Markdown notes of a class room.
 */
export async function fileNotesSet(input: FileNotesSetInput): Promise<void> {
  const result = await api("file/notes-set", input);
  throwIfError(result, {
    [ApiError.FILE_NOTES_SET_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_NOTES_SET_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.FILE_NOTES_SET_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
    [ApiError.FILE_NOTES_SET_DATABASE_ERROR]: "Database error while saving the notes.",
    [ApiError.FILE_NOTES_SET_STORAGE_ERROR]: "Unable to store the notes on the server.",
  });
}

/**
 * URL to open (or download) the content of a file, to use as the `href` of a link.
 * The browser displays it in a tab when it can (PDF, images, plain text, ...),
 * otherwise it downloads it.
 */
export function getFileUrl(fileId: number): string {
  return resolveApiUrl(`api/file/get?fileId=${fileId}`);
}

/**
 * The mime type the backend will store for this file
 * (the browser uses this default when the type is unknown).
 */
export function getFileMime(file: File): string {
  return file.type.trim().toLowerCase() || "application/octet-stream";
}
