/** Code of this activity, used to store the results of the students. */
export const ACTIVITY_CODE = "office/file-explorer";

/** Above this score, the student can go to the next exercise. */
export const MIN_SCORE = 80;

/** Best score (percentage) of a student, per exercise id. */
export type Scores = Record<string, number>;

/** Percentage of efficiency: 100 means the student found an optimal solution. */
export function computeScore(clicks: number, minimalClicks: number): number {
  if (clicks <= 0) return 100;
  return Math.min(100, Math.round((100 * minimalClicks) / clicks));
}
