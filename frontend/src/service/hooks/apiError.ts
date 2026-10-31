import { ApiError } from "@/service/calls/service";

import { useTranslation } from "./translation";

/**
 * Turn a raw error caught from a service call into an `ApiError` whose
 * `message` is translated, looked up by key `all<abs(code)>`.
 * If no translation exists for the code, the original message is kept.
 */
export function useApiError(error: Error | null): ApiError | null {
  const translate = useApiErrorTranslator();
  return error ? translate(error) : null;
}

/**
 * @returns A function that does the same as `useApiError()`, but can be
 * called outside the render, for instance in the `catch` of a promise.
 */
export function useApiErrorTranslator(): (error: unknown) => ApiError {
  const tr = useTranslation() as unknown as Record<string, string>;
  return (error: unknown) => {
    const code = error instanceof ApiError ? error.code : ApiError.TYPE_ASSERTION;
    const fallback = error instanceof Error ? error.message : String(error);
    const message = tr[`all${Math.abs(code)}`] ?? fallback;
    return new ApiError(code, message);
  };
}
