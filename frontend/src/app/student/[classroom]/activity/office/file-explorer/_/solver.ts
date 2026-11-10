import { applyClick, type Click, type ExplorerState } from "./explorer";

/**
 * Breadth-first search of the minimal number of clicks needed
 * to go from `start` to the selection `target`.
 * @param fileCount Number of files in the list (at most 24).
 * @param maxDepth The search stops after this number of clicks.
 * @returns The minimal number of clicks, or `null` if it is greater than `maxDepth`.
 */
export function solve(
  start: ExplorerState,
  target: number,
  fileCount: number,
  maxDepth: number,
): number | null {
  const clicks = allClicks(fileCount);
  const visited = new Uint8Array(1 << (fileCount + 5));
  const key = ({ mask, anchor }: ExplorerState) => (mask << 5) | (anchor ?? 31);
  let frontier = [start];
  visited[key(start)] = 1;
  for (let depth = 0; depth <= maxDepth; depth++) {
    if (frontier.some(({ mask }) => mask === target)) return depth;

    const next: ExplorerState[] = [];
    for (const state of frontier) {
      for (const item of clicks) {
        const child = applyClick(state, item);
        const k = key(child);
        if (visited[k]) continue;

        visited[k] = 1;
        next.push(child);
      }
    }
    frontier = next;
  }
  return null;
}

function allClicks(fileCount: number): Click[] {
  const clicks: Click[] = [{ file: null, ctrl: false, shift: false }];
  for (let file = 0; file < fileCount; file++) {
    for (const ctrl of [false, true]) {
      for (const shift of [false, true]) clicks.push({ file, ctrl, shift });
    }
  }
  return clicks;
}
