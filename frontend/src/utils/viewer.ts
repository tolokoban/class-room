import type { WrittenStudentUpload } from "@/service/calls/written";

/** How the application can display an uploaded file, if it can. */
export type WrittenViewerKind = "markdown" | "text";

/**
 * @returns The viewer able to display an uploaded file, or `null` if there is none.
 */
export function getWrittenViewerKind({
  mime,
  original,
}: Pick<WrittenStudentUpload, "mime" | "original">): WrittenViewerKind | null {
  if (mime === "text/markdown" || /\.(md|markdown)$/i.test(original)) return "markdown";
  if (mime === "text/plain") return "text";
  return null;
}
