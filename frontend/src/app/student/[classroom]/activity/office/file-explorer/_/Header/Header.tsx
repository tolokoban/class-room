import { IconHelp, Theme, ViewButton, ViewFloatingButton } from "@tolokoban/ui";

import { useShowHelp } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./Header.module.css";

const $ = Theme.classNames;

export interface HeaderProps {
  className?: string;
  title: React.ReactNode;
  /** Number (starting at 1) of the current exercise, and number of exercises. */
  progress?: { index: number; count: number };
  /** Number of clicks, or `null` to hide the counter and the button. */
  clicks: number | null;
  onRestart(): void;
  /** If defined (for teachers only), a button opens the results page. */
  onResults?(): void;
}

export function Header({ className, title, progress, clicks, onRestart, onResults }: HeaderProps) {
  const tr = useTranslation();
  const showHelp = useShowHelp();
  return (
    <header className={$.join(className, Styles.header)}>
      <h1>
        {progress && (
          <span>
            <b>{progress.index}</b> / {progress.count}
          </span>
        )}
        {title}
      </h1>
      {onResults && (
        <ViewButton color="tertiary-5" onClick={onResults}>
          {tr.results}
        </ViewButton>
      )}
      {clicks !== null && (
        <>
          <div>{tr.clicks$(`${clicks}`)}</div>
          <ViewButton color="secondary-5" onClick={onRestart}>
            {tr.restart}
          </ViewButton>
          <ViewFloatingButton size="S" icon={IconHelp} onClick={showHelp} />
        </>
      )}
    </header>
  );
}
