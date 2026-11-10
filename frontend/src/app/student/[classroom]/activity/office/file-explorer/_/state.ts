import { type ExplorerState, maskOf } from "./explorer";

/** State of the explorer at the beginning of an exercise. */
export function initialState({
  initial,
  anchor,
}: {
  initial: number[];
  anchor?: number;
}): ExplorerState {
  return { mask: maskOf(initial), anchor: anchor ?? initial[0] ?? null };
}
