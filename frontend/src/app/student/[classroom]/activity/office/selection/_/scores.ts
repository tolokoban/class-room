import { isType } from "@tolokoban/type-guards";

/** Code of this activity, used to store the results of the students. */
export const ACTIVITY_CODE = "office/selection";

/** Best score (percentage) of a student, per exercise id. */
export type Scores = Record<string, number>;

/**
 * @returns The scores stored with entrypoint `activity/result-set`,
 * or an empty object if `result` is invalid.
 */
export function parseScores(result: string): Scores {
  try {
    const data: unknown = JSON.parse(result);
    if (isType(data, ["map", "number"])) return data;
  } catch (error) {
    console.error("Invalid result:", result, error);
  }
  return {};
}
