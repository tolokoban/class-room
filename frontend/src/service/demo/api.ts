import { ApiError } from "@/service/calls/service";

import { DemoContext } from "./context";
import { IndexedDbBackend } from "./db/backend";
import { DemoDatabase } from "./db/database";
import { getDemoHandler } from "./entrypoint";
import { DEMO_TEACHER } from "./teacher";

/** HTTP status of the backend for an unknown entrypoint. */
const HTTP_NOT_FOUND = 404;

let context: DemoContext | null = null;

function getContext(): DemoContext {
  if (!context) {
    context = {
      db: new DemoDatabase(new IndexedDbBackend()),
      user: DEMO_TEACHER,
      now: () => Math.floor(Date.now() / 1000),
    };
  }
  return context;
}

/**
 * Same as `api()`, but nothing is sent to the backend:
 * the entrypoint is served by its demo handler, on the IndexedDB database.
 * @returns The same thing as the PHP entrypoint (a negative number for errors).
 */
export async function demoApi(entrypoint: string, input: unknown): Promise<unknown> {
  const handler = getDemoHandler(entrypoint);
  if (!handler) {
    throw new ApiError(HTTP_NOT_FOUND, `Unknown entrypoint "${entrypoint}" in demo mode!`);
  }

  // Like `json_decode(json_encode($input))` in the backend.
  const data: unknown = input === undefined ? null : JSON.parse(JSON.stringify(input));
  const output = await handler(data, getContext());
  // Like `echo json_encode($output)`.
  return output === undefined ? null : JSON.parse(JSON.stringify(output));
}
