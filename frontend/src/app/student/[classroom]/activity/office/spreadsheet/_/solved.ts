import AtomicState from "@tolokoban/react-state";
import { isType } from "@tolokoban/type-guards";

import { persistInSessionStorage } from "@/state/session-storage";
import { State } from "@/state/state";

/**
 * Ids of the exercises solved correctly, for each user (student nickname,
 * or `teacher/{login}` for a teacher).
 */
export type SolvedExercises = Record<string, string[]>;

function isSolvedExercises(data: unknown): data is SolvedExercises {
  return isType(data, ["map", ["array", "string"]]);
}

export const SolvedState = new AtomicState<SolvedExercises>({});

persistInSessionStorage(SolvedState, "spreadsheet/solved", isSolvedExercises);

/** Ids of the exercises solved by the current user, and a function to add one. */
export function useSolvedExercises() {
  const user = State.user.useValue();
  const solved = SolvedState.useValue();
  const key = getUserKey(user);
  const ids = solved[key] ?? [];
  return {
    ids,
    markAsSolved(id: string) {
      const current = SolvedState.value[key] ?? [];
      if (current.includes(id)) return;

      SolvedState.value = { ...SolvedState.value, [key]: [...current, id] };
    },
  };
}

function getUserKey(user: typeof State.user.value): string {
  if (!user) return "";
  if (typeof user === "string") return user;
  return `teacher/${user.login}`;
}
