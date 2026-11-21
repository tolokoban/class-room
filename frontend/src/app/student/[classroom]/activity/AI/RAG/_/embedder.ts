import { type FeatureExtractionPipeline, pipeline } from "@huggingface/transformers";

import { trackDownload } from "./download";
import { MODEL_DTYPE, MODEL_ID, prepareText } from "./model";
import { decodeVectors } from "./vectors";

export { addProgressListener, type ProgressListener } from "./download";

export interface Model {
  extractor: FeatureExtractionPipeline;
  /** The precomputed embeddings of the activity (its `vectors.dat` file). */
  vectors: Float32Array;
}

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;
/** The precomputed embeddings, by URL: each activity has its own file. */
const vectorsPromises = new Map<string, Promise<Float32Array>>();

/**
 * Load the model and the precomputed embeddings only once, even if the page
 * is opened several times. The model is shared by all the activities.
 * @param vectorsUrl URL of the `vectors.dat` file of the activity.
 * @param loadExtra Other models needed by the activity, loaded at the same time.
 * They must report their progress with `trackDownload()`, to be part of the progress bar.
 */
export function loadModel(vectorsUrl: string, loadExtra?: () => Promise<unknown>): Promise<Model> {
  return Promise.all([
    loadExtractor(),
    // A few hundred kilobytes only: no need to follow its progress.
    loadVectors(vectorsUrl),
    loadExtra?.(),
  ]).then(([extractor, vectors]) => ({ extractor, vectors }));
}

/**
 * Download the model only once for all the activities, and report the progress
 * to the listeners. After a failure, the next call tries again.
 */
function loadExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    const promise = pipeline("feature-extraction", MODEL_ID, {
      dtype: MODEL_DTYPE,
      progress_callback: trackDownload,
    }) as Promise<FeatureExtractionPipeline>;
    extractorPromise = promise;
    promise.catch(() => {
      // Allow a retry when the page is opened again.
      extractorPromise = null;
    });
  }
  return extractorPromise;
}

/**
 * Download and decode a `vectors.dat` file only once.
 * After a failure, the next call tries again.
 */
function loadVectors(url: string): Promise<Float32Array> {
  let promise = vectorsPromises.get(url);
  if (!promise) {
    promise = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`Unable to load ${url}: ${response.statusText}`);

      return decodeVectors(await response.arrayBuffer());
    });
    vectorsPromises.set(url, promise);
    // Allow a retry when the page is opened again.
    promise.catch(() => vectorsPromises.delete(url));
  }
  return promise;
}

/**
 * @returns The normalized embedding vector of `text`, embedded as a query
 * (see `prepareText()`).
 */
export async function embed(extractor: FeatureExtractionPipeline, text: string): Promise<number[]> {
  const output = await extractor(prepareText(text), { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}
