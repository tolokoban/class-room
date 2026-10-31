import { Theme } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./LoadingOverlay.module.css";

const $ = Theme.classNames;

export interface LoadingOverlayProps {
  className?: string;
  /** Between 0 and 100. */
  progress: number;
  /** Estimated number of seconds, or `null` if unknown yet. */
  remaining: number | null;
}

export function LoadingOverlay({ className, progress, remaining }: LoadingOverlayProps) {
  const tr = useTranslation();
  const percent = Math.round(progress);
  return (
    <div className={$.join(className, Styles.loadingOverlay)}>
      <div>
        <header>{tr.loading}</header>
        <div className={Styles.bar}>
          <div style={{ width: `${percent}%` }} />
        </div>
        <strong>{percent} %</strong>
        <small>
          {remaining === null ? tr.estimating : tr.remaining$(formatDuration(remaining))}
        </small>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const total = Math.ceil(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  if (minutes === 0) return `${rest} s`;

  return `${minutes} min ${`${rest}`.padStart(2, "0")} s`;
}
