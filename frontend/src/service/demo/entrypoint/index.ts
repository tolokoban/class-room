import { DemoHandler } from "../context";
import { ACTIVITY } from "./activity";
import { CLASS } from "./class";
import { FILE } from "./file";
import { ROOM } from "./room";
import { USER } from "./user";
import { WRITTEN } from "./written";

/**
 * Replica of `backend/www/api/entrypoint/{group}/{action}/index.php` for the demo mode.
 * It must always be kept in sync with the backend: see `sync.test.ts`.
 */
export const DEMO_ENTRYPOINTS: Record<string, Record<string, DemoHandler>> = {
  activity: ACTIVITY,
  class: CLASS,
  file: FILE,
  room: ROOM,
  user: USER,
  written: WRITTEN,
};

export function getDemoHandler(entrypoint: string): DemoHandler | undefined {
  const [group, action, ...rest] = entrypoint.split("/");
  if (rest.length > 0 || !Object.prototype.hasOwnProperty.call(DEMO_ENTRYPOINTS, group))
    return undefined;

  const handlers = DEMO_ENTRYPOINTS[group];
  return Object.prototype.hasOwnProperty.call(handlers, action) ? handlers[action] : undefined;
}
