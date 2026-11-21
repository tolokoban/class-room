import { Theme } from "@tolokoban/ui";

import { WrittenTimer as WrittenTimerData } from "@/service/calls/written";

import { formatDuration, useTimerValue } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./WrittenTimer.module.css";

const $ = Theme.classNames;

export interface WrittenTimerProps {
  className?: string;
  timer: WrittenTimerData;
  /** UNIX timestamp (seconds) of the server when `timer` has been fetched. */
  now: number;
  /** Default to "large". */
  size?: "large" | "small";
  /** If `true`, nothing is displayed once the time is over. Default to `false`. */
  hideWhenOver?: boolean;
}

/**
 * Time left before the end of a written production.
 * Once the time is over, display the time elapsed since the end, unless `hideWhenOver` is set.
 */
export function WrittenTimer({
  className,
  timer,
  now,
  size = "large",
  hideWhenOver = false,
}: WrittenTimerProps) {
  const tr = useTranslation();
  const { state, seconds } = useTimerValue(timer, now);
  const isOver = state !== "idle" && seconds < 0;
  if (isOver && hideWhenOver) return null;

  const label = isOver ? tr.over : tr[state];

  return (
    <div
      className={$.join(
        className,
        Styles.writtenTimer,
        Styles[size],
        Styles[state],
        isOver && Styles.over,
      )}
    >
      <div>{label}</div>
      {state !== "idle" && <strong>{formatDuration(seconds)}</strong>}
    </div>
  );
}
