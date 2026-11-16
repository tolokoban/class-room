import React from "react";

import { WrittenTimer } from "@/service/calls/written";

export interface TimerValue {
  state: WrittenTimer["state"];
  /** Seconds before the end of the exercise (negative once it is over). */
  seconds: number;
}

/**
 * Seconds left before the end of the exercise, updated every second.
 * The clock of the computer can be different from the one of the server:
 * `serverNow` is used to compute the offset between them.
 *
 * @param serverNow UNIX timestamp (seconds) of the server when `timer` has been fetched.
 */
export function useTimerValue(timer: WrittenTimer, serverNow: number): TimerValue {
  const offset = React.useMemo(() => serverNow - Date.now() / 1000, [serverNow]);
  const [now, setNow] = React.useState(() => Date.now() / 1000 + offset);
  React.useEffect(() => {
    setNow(Date.now() / 1000 + offset);
    if (timer.state !== "running") return;

    const id = globalThis.setInterval(() => setNow(Date.now() / 1000 + offset), 1000);
    return () => globalThis.clearInterval(id);
  }, [timer.state, offset]);

  if (timer.state === "running" && timer.endTime !== null) {
    return { state: "running", seconds: Math.ceil(timer.endTime - now) };
  }
  if (timer.state === "paused" && timer.remaining !== null) {
    return { state: "paused", seconds: timer.remaining };
  }
  return { state: "idle", seconds: 0 };
}

/**
 * @returns `m:ss` or `h:mm:ss` (the sign is ignored).
 */
export function formatDuration(seconds: number): string {
  const total = Math.abs(Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}
