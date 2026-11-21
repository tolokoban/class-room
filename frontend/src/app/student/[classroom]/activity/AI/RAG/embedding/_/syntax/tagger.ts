import { pipeline, type TokenClassificationPipeline } from "@huggingface/transformers";

import { trackDownload } from "../../../_/download";
import { buildWords, type Prediction, type TaggedWord } from "./words";

/**
 * CamemBERT fine-tuned for French part-of-speech tagging, with the tags
 * of the French Treebank (≈ 110 Mo once quantized).
 */
const POS_MODEL_ID = "Xenova/french-camembert-postag-model";
const POS_MODEL_DTYPE = "q8";

let taggerPromise: Promise<TokenClassificationPipeline> | null = null;

/**
 * Download the part-of-speech model only once, and report its progress
 * with the other models (see `trackDownload()`).
 * After a failure, the next call tries again.
 */
export function loadTagger(): Promise<TokenClassificationPipeline> {
  if (!taggerPromise) {
    const promise = pipeline("token-classification", POS_MODEL_ID, {
      dtype: POS_MODEL_DTYPE,
      progress_callback: trackDownload,
    }) as Promise<TokenClassificationPipeline>;
    taggerPromise = promise;
    promise.catch(() => {
      taggerPromise = null;
    });
  }
  return taggerPromise;
}

/**
 * Give each word of `text` its part of speech.
 * Caveat: the model is bad at inverted questions ("Mange-t-il…"):
 * use `normalize()` on the text first.
 */
export async function tagWords(text: string): Promise<TaggedWord[]> {
  const tagger = await loadTagger();
  // By default, the tag "O" (no tag) is ignored: we want all the pieces.
  const output = await tagger(text, { ignore_labels: [] });
  const predictions = new Map<number, Prediction>(
    output.map(({ index, entity, score }) => [index, { tag: entity, score }]),
  );
  return buildWords(tagger.tokenizer.tokenize(text), predictions);
}
