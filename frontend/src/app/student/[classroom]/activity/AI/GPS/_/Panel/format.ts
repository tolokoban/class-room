/** Length of a cell, in meters. */
export const CELL_LENGTH = 10;
/** Time needed to cross a road cell, in minutes (a highway cell takes ten times less). */
export const CELL_DURATION = 1;

export function formatDistance(cells: number): string {
  return `${cells * CELL_LENGTH}`;
}

/**
 * Duration of a path, like "1 h 27 min" or "45 min", rounded to the minute.
 * @param cost Cost of the path: 1 per road cell and 1/10 per highway cell.
 */
export function formatDuration(cost: number): string {
  const total = Math.round(cost * CELL_DURATION);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
