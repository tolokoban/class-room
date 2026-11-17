import { isType } from "@tolokoban/type-guards";

import { EXERCISE_IDS, type ExerciseId } from "../exercises";

/** Code of this activity, used to store the results of the students. */
export const ACTIVITY_CODE = "office/markdown";

/**
 * @returns The ids of the exercises done right, from the result stored with
 * entrypoint `activity/result-set` (a JSON array of ids).
 */
export function parseDone(result: string): ExerciseId[] {
  try {
    const data: unknown = JSON.parse(result);
    if (isType(data, ["array", "string"])) {
      return EXERCISE_IDS.filter((id) => data.includes(id));
    }
  } catch (error) {
    console.error("Invalid result:", result, error);
  }
  return [];
}

/** @returns 100 for each exercise done right, 0 for the others. */
export function parseScores(result: string): Record<string, number> {
  const done = parseDone(result);
  return Object.fromEntries(EXERCISE_IDS.map((id) => [id, done.includes(id) ? 100 : 0]));
}

/**
 * The exercises done are also kept in the session storage, per class room,
 * so that a refresh of the page does not lose them even if they are not stored
 * in the database (for teachers, or while the database is loading).
 */
function sessionKey(classroomCode: string): string {
  return `${ACTIVITY_CODE}/done/${classroomCode}`;
}

export function readSessionDone(classroomCode: string): ExerciseId[] {
  try {
    const text = window.sessionStorage.getItem(sessionKey(classroomCode));
    return text ? parseDone(text) : [];
  } catch {
    return [];
  }
}

export function writeSessionDone(classroomCode: string, done: ExerciseId[]) {
  try {
    window.sessionStorage.setItem(sessionKey(classroomCode), JSON.stringify(done));
  } catch (error) {
    console.error("Unable to store the exercises done in the session storage:", error);
  }
}
