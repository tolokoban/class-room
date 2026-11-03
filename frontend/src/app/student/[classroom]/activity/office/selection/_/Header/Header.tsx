import { Theme, ViewButton } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Header.module.css";

const $ = Theme.classNames;

export interface HeaderProps {
  className?: string;
  title: React.ReactNode;
  /** Number (starting at 1) of the current exercise, and number of exercises. */
  progress?: { index: number; count: number };
  /** Number of keystrokes, or `null` to hide the counter and the button. */
  strokes: number | null;
  onRestart(): void;
  /** If defined (for teachers only), a button opens the results page. */
  onResults?(): void;
}

export function Header({ className, title, progress, strokes, onRestart, onResults }: HeaderProps) {
  const tr = useTranslation();
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
      {strokes !== null && (
        <>
          <div>{tr.strokes$(`${strokes}`)}</div>
          <ViewButton color="secondary-5" onClick={onRestart}>
            {tr.restart}
          </ViewButton>
        </>
      )}
    </header>
  );
}
