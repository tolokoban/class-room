/**
 * Shared by the browser and by the script that precomputes the embeddings
 * (`generate.mts`): both must use exactly the same model and settings,
 * otherwise the vectors cannot be compared.
 */

/** Small multilingual model (≈ 120 Mo once quantized), good in French. */
export const MODEL_ID = "Xenova/multilingual-e5-small";
export const MODEL_DTYPE = "q8";
/** Number of dimensions of the vectors produced by this model. */
export const EMBEDDING_SIZE = 384;

/**
 * The E5 models expect a prefix. "query: " is advised
 * for symmetric tasks, like comparing two questions.
 */
export function prepareText(text: string): string {
  return `query: ${text.trim()}`;
}
