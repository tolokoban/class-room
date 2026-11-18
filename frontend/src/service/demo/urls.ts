/**
 * Some entrypoints are not called with `api()`, but used as the URL of a link
 * (`file/get`, `written/download`, `written/zip`, `written/attachment-get`).
 * In demo mode, such a URL would reach the backend: instead, the demo handlers
 * register the content behind each URL as a blob URL, before returning the data
 * that will be rendered as links (`file/list`, `written/results`, ...).
 *
 * Keys are the URLs of the real backend, e.g. `api/file/get?fileId=12`.
 */
const cache = new Map<string, string>();

/**
 * Make `apiUrl` point to `blob` in demo mode.
 */
export function registerDemoUrl(apiUrl: string, blob: Blob) {
  forgetDemoUrl(apiUrl);
  cache.set(apiUrl, URL.createObjectURL(blob));
}

export function forgetDemoUrl(apiUrl: string) {
  const url = cache.get(apiUrl);
  if (!url) return;

  URL.revokeObjectURL(url);
  cache.delete(apiUrl);
}

/**
 * @returns The blob URL registered for `apiUrl`, or `undefined`.
 */
export function getDemoUrl(apiUrl: string): string | undefined {
  return cache.get(apiUrl);
}
