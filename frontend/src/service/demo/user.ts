import { isTeacher, State, Teacher } from "@/state";

import { setLinksDemoMode } from "./links";
import { DEMO_ROLE, DEMO_TEACHER } from "./teacher";

export { DEMO_ROLE, DEMO_TEACHER };

export function isDemoUser(user: unknown): user is Teacher {
  return isTeacher(user) && user.roles.includes(DEMO_ROLE);
}

/** Are we in demo mode (the connected user is the fake "Demo Teacher")? */
export function isDemoMode(): boolean {
  return isDemoUser(State.user.value);
}

/** Log in as the fake "Demo Teacher". */
export function startDemo() {
  State.user.value = DEMO_TEACHER;
}

setLinksDemoMode(isDemoMode());
State.user.addListener((user) => setLinksDemoMode(isDemoUser(user)));
