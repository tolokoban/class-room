/**
 * Segmentation of the fables into chunks, used by `generate.mts`.
 * In the sources, verses are separated by "\n" and paragraphs by "\n\n".
 */

/** Verses per chunk, for the fables in verse (La Fontaine). */
export const VERSES_PER_CHUNK = 4;
/** Sentences per chunk, for the fables in prose (Ésope and Phèdre). */
export const SENTENCES_PER_CHUNK = 3;
/** Number of verses or sentences shared by two consecutive chunks. */
export const OVERLAP = 1;

/**
 * Cut a fable in verse into chunks of `VERSES_PER_CHUNK` verses,
 * each one starting with the last verse of the previous one.
 */
export function segmentVerses(text: string): string[] {
  const verses = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return windows(verses, VERSES_PER_CHUNK).map((chunk) => chunk.join("\n"));
}

/**
 * Cut a fable in prose into chunks of `SENTENCES_PER_CHUNK` sentences,
 * each one starting with the last sentence of the previous one.
 * The moral is in a paragraph of its own, and it is kept as a chunk of its own too,
 * always the last one.
 * @param moral Where the moral is in the text: Ésope ends each fable with it ("last"),
 * Phèdre starts each fable with it ("first"). If there is only one paragraph,
 * there is no moral.
 */
export function segmentProse(text: string, moral: "first" | "last" = "last"): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
  const lesson =
    paragraphs.length > 1 ? (moral === "first" ? paragraphs.shift() : paragraphs.pop()) : undefined;
  const sentences = paragraphs.flatMap(splitSentences);
  const chunks = windows(sentences, SENTENCES_PER_CHUNK).map((chunk) => chunk.join(" "));
  return lesson ? [...chunks, lesson] : chunks;
}

/**
 * Split a paragraph after each period, exclamation or question mark followed
 * by an upper case letter or an opening quote, even inside a quotation.
 */
export function splitSentences(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.!?…](?:\s*»)?)\s+(?=[«\p{Lu}])/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * Sliding windows of `size` items, overlapping by `OVERLAP` items.
 * The last window can be shorter, but never only made of the overlap.
 */
function windows<T>(items: T[], size: number): T[][] {
  if (items.length <= size) return items.length > 0 ? [items] : [];

  const step = size - OVERLAP;
  const result: T[][] = [];
  for (let start = 0; start + OVERLAP < items.length; start += step) {
    result.push(items.slice(start, start + size));
  }
  return result;
}
