/**
 * Shared by the browser and by the scripts that precompute the embeddings
 * (the `generate.mts` of each activity): all of them must use exactly the same
 * model and settings, otherwise the vectors cannot be compared.
 */

/** Small multilingual model (≈ 120 Mo once quantized), good in French. */
export const MODEL_ID = "Xenova/multilingual-e5-small";
export const MODEL_DTYPE = "q8";
/** Number of dimensions of the vectors produced by this model. */
export const EMBEDDING_SIZE = 384;

/**
 * - `query`: a question, or any text compared with other texts of the same kind.
 * - `passage`: a document in which we look for the answer to a `query`.
 */
export type TextKind = "query" | "passage";

/**
 * The E5 models expect a prefix: "query: " for what we look for, and
 * "passage: " for the documents we look into. For symmetric tasks,
 * like comparing two questions, "query: " is advised for both.
 * @param kind The default is `"query"`.
 */
export function prepareText(text: string, kind: TextKind = "query"): string {
  return `${kind}: ${text.trim()}`;
}
