import { type FeatureExtractionPipeline, pipeline } from "@huggingface/transformers";

import { MODEL_DTYPE, MODEL_ID, prepareText } from "./model";
import { decodeVectors } from "./vectors";

import VectorsUrl from "./data/vectors.dat";

/**
 * @param progress Percentage of the download, between 0 and 100.
 * @param remaining Estimated number of seconds before the end of the download,
 * or `null` if it is too early to know.
 */
export type ProgressListener = (progress: number, remaining: number | null) => void;

/** Do not estimate the remaining time before this delay (in ms): it would be too random. */
const MIN_ELAPSED_FOR_ESTIMATION = 2000;

export interface Model {
  extractor: FeatureExtractionPipeline;
  /** The precomputed embeddings of the questions and the animals' names. */
  vectors: Float32Array;
}

let modelPromise: Promise<Model> | null = null;
const progressListeners = new Set<ProgressListener>();

export function addProgressListener(listener: ProgressListener) {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

/**
 * Load the model and the precomputed embeddings only once, even if the page is opened several times.
 */
export function loadModel(): Promise<Model> {
  if (!modelPromise) {
    const startTime = Date.now();
    const progress_callback = (info: { status: string; progress?: number }) => {
      if (info.status !== "progress_total" || typeof info.progress !== "number") return;

      const { progress } = info;
      const elapsed = Date.now() - startTime;
      // We assume the download speed stays constant.
      const remaining =
        progress > 0 && elapsed > MIN_ELAPSED_FOR_ESTIMATION
          ? (elapsed * (100 - progress)) / progress / 1000
          : null;
      for (const listener of progressListeners) listener(progress, remaining);
    };
    modelPromise = Promise.all([
      pipeline("feature-extraction", MODEL_ID, {
        dtype: MODEL_DTYPE,
        progress_callback,
      }) as Promise<FeatureExtractionPipeline>,
      // A few hundred kilobytes only: no need to follow its progress.
      loadVectors(),
    ]).then(([extractor, vectors]) => ({ extractor, vectors }));
    modelPromise.catch(() => {
      // Allow a retry when the page is opened again.
      modelPromise = null;
    });
  }
  return modelPromise;
}

async function loadVectors(): Promise<Float32Array> {
  const response = await fetch(VectorsUrl);
  if (!response.ok) throw new Error(`Unable to load ${VectorsUrl}: ${response.statusText}`);

  return decodeVectors(await response.arrayBuffer());
}

/**
 * @returns The normalized embedding vector of `text`.
 */
export async function embed(extractor: FeatureExtractionPipeline, text: string): Promise<number[]> {
  const output = await extractor(prepareText(text), { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}
