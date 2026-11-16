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
}

/**
 * Time left before the end of a written production.
 */
export function WrittenTimer({ className, timer, now, size = "large" }: WrittenTimerProps) {
  const tr = useTranslation();
  const { state, seconds } = useTimerValue(timer, now);
  const isOver = state !== "idle" && seconds < 0;
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
