/**
 * The teacher chooses the accepted types of an expected file among these presets.
 * The mime types must match `WRITTEN_MIME_EXTENSIONS` in `backend/www/api/written.php`.
 */
export type MimePresetKey =
  | "pdf"
  | "word"
  | "spreadsheet"
  | "presentation"
  | "image"
  | "text"
  | "archive";

export interface MimePreset {
  key: MimePresetKey;
  mimeTypes: string[];
  /** Used in the `accept` attribute of the file inputs. */
  extensions: string[];
}

export const MIME_PRESETS: MimePreset[] = [
  { key: "pdf", mimeTypes: ["application/pdf"], extensions: [".pdf"] },
  {
    key: "word",
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "application/rtf",
      "text/rtf",
    ],
    extensions: [".doc", ".docx", ".odt", ".rtf"],
  },
  {
    key: "spreadsheet",
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.oasis.opendocument.spreadsheet",
      "text/csv",
    ],
    extensions: [".xls", ".xlsx", ".ods", ".csv"],
  },
  {
    key: "presentation",
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.oasis.opendocument.presentation",
    ],
    extensions: [".ppt", ".pptx", ".odp"],
  },
  {
    key: "image",
    mimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    extensions: [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  { key: "text", mimeTypes: ["text/plain", "text/markdown"], extensions: [".txt", ".md"] },
  {
    key: "archive",
    mimeTypes: ["application/zip", "application/x-zip-compressed", "application/x-7z-compressed"],
    extensions: [".zip", ".7z"],
  },
];

/**
 * @returns The presets whose mime types are all in `mimeTypes`,
 * and the mime types that are not part of any of these presets.
 */
export function splitMimeTypes(mimeTypes: string[]): { presets: MimePreset[]; others: string[] } {
  const presets = MIME_PRESETS.filter((preset) =>
    preset.mimeTypes.every((mime) => mimeTypes.includes(mime)),
  );
  const covered = new Set(presets.flatMap((preset) => preset.mimeTypes));
  return { presets, others: mimeTypes.filter((mime) => !covered.has(mime)) };
}

/**
 * @returns The mime types of a list of presets.
 */
export function getPresetsMimeTypes(keys: MimePresetKey[]): string[] {
  return MIME_PRESETS.filter((preset) => keys.includes(preset.key)).flatMap(
    (preset) => preset.mimeTypes,
  );
}

/**
 * @returns The value of the `accept` attribute of a file input,
 * or `undefined` if any type is accepted.
 */
export function getAcceptAttribute(mimeTypes: string[]): string | undefined {
  if (mimeTypes.length === 0) return undefined;

  const { presets } = splitMimeTypes(mimeTypes);
  return [...mimeTypes, ...presets.flatMap((preset) => preset.extensions)].join(",");
}
