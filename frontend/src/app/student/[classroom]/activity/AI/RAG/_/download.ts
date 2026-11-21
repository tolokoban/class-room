import type { ProgressInfo } from "@huggingface/transformers";

/**
 * @param progress Percentage of the download, between 0 and 100.
 * @param remaining Estimated number of seconds before the end of the download,
 * or `null` if it is too early to know.
 */
export type ProgressListener = (progress: number, remaining: number | null) => void;

/** Do not estimate the remaining time before this delay (in ms): it would be too random. */
const MIN_ELAPSED_FOR_ESTIMATION = 2000;

interface Download {
  loaded: number;
  total: number;
}

/** The models being downloaded together, by model ID. */
const downloads = new Map<string, Download>();
let startTime = 0;
const progressListeners = new Set<ProgressListener>();

export function addProgressListener(listener: ProgressListener) {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

/**
 * The `progress_callback` to give to `pipeline()`. When several models are
 * downloaded at the same time, the listeners get one progress for all of them,
 * computed on the bytes: a big model counts more than a small one.
 *
 * Caveat: the size of a model is known only when its download starts.
 * Start all the downloads at the same time, otherwise the progress can go back.
 */
export function trackDownload(info: ProgressInfo) {
  if (info.status !== "progress_total") return;

  if (!downloads.has(info.name) && isEverythingLoaded()) {
    // A new batch of downloads, long after the previous one.
    downloads.clear();
    startTime = Date.now();
  }
  downloads.set(info.name, { loaded: info.loaded, total: info.total });
  let loaded = 0;
  let total = 0;
  for (const download of downloads.values()) {
    loaded += download.loaded;
    total += download.total;
  }
  if (total <= 0) return;

  const progress = (100 * loaded) / total;
  const elapsed = Date.now() - startTime;
  // We assume the download speed stays constant.
  const remaining =
    loaded > 0 && elapsed > MIN_ELAPSED_FOR_ESTIMATION
      ? (elapsed * (total - loaded)) / loaded / 1000
      : null;
  for (const listener of progressListeners) listener(progress, remaining);
}

function isEverythingLoaded(): boolean {
  for (const { loaded, total } of downloads.values()) {
    if (loaded < total) return false;
  }
  return true;
}
