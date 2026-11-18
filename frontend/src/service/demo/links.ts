import { getDemoUrl } from "./urls";

/** Used when the content of a URL has not been registered: it never reaches the backend. */
const EMPTY_URL = "about:blank";

/**
 * Kept up to date by `user.ts`, so that this module (imported by `service/calls/*`)
 * does not depend on `@/state`.
 */
let demoMode = false;

export function setLinksDemoMode(value: boolean) {
  demoMode = value;
}

/**
 * @returns `apiUrl` itself out of the demo mode, or the blob URL registered for it
 * by the demo handlers (see `registerDemoUrl()`).
 */
export function resolveApiUrl(apiUrl: string): string {
  if (!demoMode) return apiUrl;

  return getDemoUrl(apiUrl) ?? EMPTY_URL;
}
