/** A word of the sentence, with its part of speech (see `tags.ts`). */
export interface TaggedWord {
  text: string;
  /** Tag of the French Treebank: "V", "NC", "DET"… or "?" if the model gave none. */
  tag: string;
  /** Confidence of the model, between 0 and 1. */
  score: number;
}

export interface Prediction {
  tag: string;
  score: number;
}

/**
 * Join words into a sentence, without a space after an apostrophe:
 * "c'" and "est" give "c'est".
 */
export function joinWords(words: TaggedWord[]): string {
  return words
    .map(({ text }) => (text.endsWith("'") ? text : `${text} `))
    .join("")
    .trim();
}

/** SentencePiece marks the pieces that start a new word with this character. */
const WORD_START = "▁";

/**
 * Join the pieces of the tokenizer into words. The tag of a word is the tag of its
 * first non-empty piece: "Mange" can be cut into "M" + "ange", and only "M" counts.
 *
 * An apostrophe ends its word, because the tokenizer glues "c'est" into one word,
 * whereas "c'" and "est" have different tags.
 *
 * @param pieces The pieces given by `tokenizer.tokenize()`, with their "▁".
 * @param predictions The predictions of the model, by index of piece.
 * Caveat: the model counts its special start token, so the piece `i` has the index `i + 1`.
 */
export function buildWords(pieces: string[], predictions: Map<number, Prediction>): TaggedWord[] {
  const words: Array<{ text: string; prediction?: Prediction }> = [];
  let closed = true;
  pieces.forEach((piece, position) => {
    const startsWord = piece.startsWith(WORD_START);
    const text = startsWord ? piece.slice(WORD_START.length) : piece;
    const prediction = text.length > 0 ? predictions.get(position + 1) : undefined;
    const current = words[words.length - 1];
    if (text === "'" && current) {
      current.text += text;
      closed = true;
      return;
    }
    if (startsWord || closed || !current) {
      words.push({ text, prediction });
    } else {
      current.text += text;
      current.prediction ??= prediction;
    }
    // "▁" alone: the word continues in the next piece.
    closed = false;
  });
  return words
    .filter(({ text }) => text.length > 0)
    .map(({ text, prediction }) => ({
      text,
      tag: prediction?.tag ?? "?",
      score: prediction?.score ?? 0,
    }));
}
