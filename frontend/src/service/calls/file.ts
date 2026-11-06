import { isString, isType } from "@tolokoban/type-guards";

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

export interface FileAddInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** Name of the file, with its extension. Must be unique in the class room. */
  name: string;
  /** Content of the file as a base64 data URL (see `readFileAsDataUrl()`). */
  file: string;
}

/**
 * Upload a new file in a class room of the current teacher.
 * @returns The ID of the new file.
 */
export async function fileAdd(input: FileAddInput): Promise<number> {
  const result = await api("file/add", input);
  throwIfError(result, {
    [ApiError.FILE_ADD_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_ADD_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.FILE_ADD_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
    [ApiError.FILE_ADD_NAME_USED]: `There is already a file called "${input.name}" in this class room.`,
    [ApiError.FILE_ADD_DATABASE_ERROR]: "Database error while adding the file.",
    [ApiError.FILE_ADD_STORAGE_ERROR]: "Unable to store the file on the server.",
    [ApiError.FILE_ADD_RESERVED_NAME]: `The name "${input.name}" is reserved.`,
  });
  if (!isType(result, { fileId: "number" })) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/add"');
  }
  return result.fileId;
}

export interface FileReplaceInput {
  /** Field `id` of table `files`. */
  fileId: number;
  /** New name of the file, with its extension. */
  name: string;
  /**
   * Content of the file as a base64 data URL (see `readFileAsDataUrl()`).
   * It must have the same mime type as the replaced file.
   */
  file: string;
}

/**
 * Replace the content and the name of an existing file.
 * @returns The ID of the file.
 */
export async function fileReplace(input: FileReplaceInput): Promise<number> {
  const result = await api("file/replace", input);
  throwIfError(result, {
    [ApiError.FILE_REPLACE_INVALID_INPUT]: "Invalid input.",
    [ApiError.FILE_REPLACE_NOT_FOUND]: `There is no file with ID #${input.fileId}.`,
    [ApiError.FILE_REPLACE_FORBIDDEN]: `You are not the owner of file #${input.fileId}.`,
    [ApiError.FILE_REPLACE_NAME_USED]: `There is already another file called "${input.name}" in this class room.`,
    [ApiError.FILE_REPLACE_MIME_MISMATCH]:
      "The new file must have the same type as the replaced one.",
    [ApiError.FILE_REPLACE_DATABASE_ERROR]: "Database error while replacing the file.",
    [ApiError.FILE_REPLACE_STORAGE_ERROR]: "Unable to store the file on the server.",
    [ApiError.FILE_REPLACE_RESERVED_NAME]: `The name "${input.name}" is reserved.`,
  });
  if (!isType(result, { fileId: "number" })) {
    throw new ApiErrorTypeAssertion('Invalid response for "file/replace"');
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
  return `api/file/get?fileId=${fileId}`;
}

/**
 * Read a file picked by the user as a base64 data URL:
 * `data:<mime>;base64,<content>`.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () =>
      reject(reader.error ?? new Error(`Unable to read "${file.name}"!`)),
    );
    reader.readAsDataURL(file);
  });
}

/**
 * The mime type the backend will store for this file
 * (the browser uses this default when the type is unknown).
 */
export function getFileMime(file: File): string {
  return file.type.trim().toLowerCase() || "application/octet-stream";
}
