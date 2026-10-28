import { ApiError } from "@/service/calls/service";

import { useTranslation } from "./translation";

/**
 * Turn a raw error caught from a service call into an `ApiError` whose
 * `message` is translated, looked up by key `all<abs(code)>`.
 * If no translation exists for the code, the original message is kept.
 */
export function useApiError(error: Error | null): ApiError | null {
  const tr = useTranslation() as unknown as Record<string, string>;
  if (!error) return null;

  const code = error instanceof ApiError ? error.code : ApiError.TYPE_ASSERTION;
  const message = tr[`all${Math.abs(code)}`] ?? error.message;
  return new ApiError(code, message);
}
