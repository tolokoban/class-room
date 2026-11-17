/**
 * Ids of the sections of the help, in display order.
 * The ids of the exercises are reused, so that each exercise can open its own section.
 * For each id, the translation has the keys `xxxTitle`, `xxxText` and `xxxExample`.
 */
export const SECTIONS = [
  "paragraphs",
  "lineBreak",
  "title",
  "subtitles",
  "bold",
  "italic",
  "strikethrough",
  "bulletList",
  "numberedList",
  "nestedList",
  "taskList",
  "inlineCode",
  "codeBlock",
  "quote",
  "link",
  "image",
  "separator",
  "table",
  "tableAlign",
  "escape",
  "footnote",
] as const;

export type SectionId = (typeof SECTIONS)[number];

export function isSectionId(id: string | undefined): id is SectionId {
  return SECTIONS.includes(id as SectionId);
}
