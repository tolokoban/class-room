import type { Teacher } from "@/state";

/** Role that only the fake teacher of the demo mode has. */
export const DEMO_ROLE = "demo";

/**
 * The fake teacher of the demo mode.
 * Nothing is sent to the backend while this user is connected:
 * every entrypoint is served by `demoApi()` from an IndexedDB database.
 */
export const DEMO_TEACHER: Teacher = {
  id: 1,
  name: "Demo Teacher",
  login: "demo",
  roles: ["teacher", DEMO_ROLE],
};
