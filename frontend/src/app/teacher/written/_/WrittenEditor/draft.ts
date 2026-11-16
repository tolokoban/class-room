import { getPresetsMimeTypes, MimePresetKey, splitMimeTypes } from "@/components/MimePresets";
import { WrittenDefinition, WrittenItem } from "@/service/calls/written";
import { nextId } from "@/utils/id";

const MB = 1024 * 1024;

export interface DraftFile {
  /** Stable key for React. */
  key: string;
  name: string;
  presets: MimePresetKey[];
  /** Max size in MB. */
  maxSizeMB: number;
}

export interface Draft {
  name: string;
  description: string;
  duration: number;
  expiration: number;
  files: DraftFile[];
}

export function makeDraftFile(name = ""): DraftFile {
  return { key: nextId(), name, presets: [], maxSizeMB: 10 };
}

export function itemToDraft(item: WrittenItem | undefined): Draft {
  if (!item) {
    return { name: "", description: "", duration: 45, expiration: 24, files: [makeDraftFile()] };
  }
  return {
    name: item.name,
    description: item.description,
    duration: item.duration,
    expiration: item.expiration,
    files: item.files.map((file) => ({
      key: nextId(),
      name: file.name,
      presets: splitMimeTypes(file.mimeTypes).presets.map((preset) => preset.key),
      maxSizeMB: Math.max(1, Math.round(file.maxSize / MB)),
    })),
  };
}

export function draftToDefinition(draft: Draft): WrittenDefinition {
  return {
    name: draft.name.trim(),
    description: draft.description,
    duration: draft.duration,
    expiration: draft.expiration,
    files: draft.files.map((file) => ({
      name: file.name.trim(),
      mimeTypes: getPresetsMimeTypes(file.presets),
      maxSize: file.maxSizeMB * MB,
    })),
  };
}

export type DraftError =
  | { key: "errorName" | "errorNoFile" }
  | { key: "errorFileName" | "errorFileDuplicate"; name: string };

/** Same rules as `isValidSlotName()` in `backend/www/api/written.php`. */
const RX_INVALID_FILE_NAME = /^\.|[/\\:*?"<>|]/;

function isValidFileName(name: string): boolean {
  if (name === "" || name.length > 64 || RX_INVALID_FILE_NAME.test(name)) return false;

  return [...name].every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127);
}

/**
 * @returns The first error of a draft, or `null` if it can be saved.
 */
export function validateDraft(draft: Draft): DraftError | null {
  if (draft.name.trim() === "") return { key: "errorName" };
  if (draft.files.length === 0) return { key: "errorNoFile" };

  const names = new Set<string>();
  for (const file of draft.files) {
    const name = file.name.trim();
    if (!isValidFileName(name)) return { key: "errorFileName", name };
    if (names.has(name.toLowerCase())) return { key: "errorFileDuplicate", name };

    names.add(name.toLowerCase());
  }
  return null;
}

/**
 * When an expected file is removed or renamed, the files uploaded for it are deleted.
 * @returns The number of uploaded files that would be deleted by saving this draft.
 */
export function countDeletedUploads(item: WrittenItem | undefined, draft: Draft): number {
  if (!item) return 0;

  const names = new Set(draft.files.map((file) => file.name.trim()));
  return item.files
    .filter((file) => !names.has(file.name))
    .reduce((total, file) => total + (item.uploads[file.name] ?? 0), 0);
}
