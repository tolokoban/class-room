/**
 * Upload of large files by chunks, used by the entrypoints `*-init`, `*-chunk` and `*-complete`
 * of the groups `file` and `written`: the server refuses requests larger than a few MB.
 */

/** Number of attempts to send a chunk before giving up. */
const CHUNK_ATTEMPTS = 3;

export interface SendChunksOptions {
  file: File;
  /** Maximum size of a chunk in bytes, given by the `*-init` entrypoint. */
  chunkSize: number;
  /** Called after each chunk with a value between 0 and 1. */
  onProgress?(progress: number): void;
  /** Abort the upload. */
  signal?: AbortSignal;
}

/**
 * Send the content of a file chunk by chunk, each one encoded in base64.
 * A chunk that fails is sent again (up to `CHUNK_ATTEMPTS` times), whatever the error.
 * @param sendChunk Call to the `*-chunk` entrypoint.
 */
export async function sendChunks(
  { file, chunkSize, onProgress, signal }: SendChunksOptions,
  sendChunk: (offset: number, data: string) => Promise<unknown>,
): Promise<void> {
  onProgress?.(0);
  for (let offset = 0; offset < file.size; offset += chunkSize) {
    signal?.throwIfAborted();
    const data = await readAsBase64(file.slice(offset, offset + chunkSize));
    await withRetry(() => sendChunk(offset, data));
    onProgress?.(Math.min(1, (offset + chunkSize) / file.size));
  }
}

/**
 * Run `action` until it succeeds, waiting 1s, then 2s... between the attempts.
 * The error of the last attempt is thrown.
 */
async function withRetry<T>(action: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= CHUNK_ATTEMPTS) throw error;

      await new Promise((resolve) => globalThis.setTimeout(resolve, 1000 * attempt));
    }
  }
}

/**
 * @returns The content of a blob encoded in base64 (without the `data:` prefix).
 */
function readAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const url = String(reader.result);
      resolve(url.slice(url.indexOf(",") + 1));
    });
    reader.addEventListener("error", () =>
      reject(reader.error ?? new Error("Unable to read the file!")),
    );
    reader.readAsDataURL(blob);
  });
}
