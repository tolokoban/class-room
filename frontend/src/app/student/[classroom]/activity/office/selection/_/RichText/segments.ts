import { type RichText } from "../rich-text";

export type Segment =
  | { caret: true }
  | { caret: false; text: string; bold: boolean; selected: boolean };

/**
 * Group the characters into segments of same boldness and selection,
 * and insert the caret at the cursor position.
 */
export function computeSegments(text: RichText, cursor?: number, anchor?: number): Segment[] {
  const from = Math.min(cursor ?? -1, anchor ?? cursor ?? -1);
  const to = Math.max(cursor ?? -1, anchor ?? cursor ?? -1);
  const segments: Segment[] = [];
  let current: Segment | null = null;
  for (let index = 0; index <= text.length; index++) {
    if (index === cursor) {
      segments.push({ caret: true });
      current = null;
    }
    const item = text[index];
    if (!item) break;

    const selected = index >= from && index < to;
    // A selected line break is shown as a highlighted space.
    const char = selected && item.char === "\n" ? " \n" : item.char;
    if (current && !current.caret && current.bold === item.bold && current.selected === selected) {
      current.text += char;
    } else {
      current = { caret: false, text: char, bold: item.bold, selected };
      segments.push(current);
    }
  }
  return segments;
}
