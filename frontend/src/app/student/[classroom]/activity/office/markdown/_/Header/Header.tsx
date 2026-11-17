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
  /** The current exercise has already been done right. */
  done?: boolean;
  /** Id of the help section to display first. */
  helpSection?: string;
  /** If undefined, the button "Previous" is disabled. */
  onPrevious?(): void;
  /** If undefined, the button "Next" is hidden. */
  onNext?(): void;
  /** If defined (for teachers only), a button opens the results page. */
  onResults?(): void;
}

export function Header(props: HeaderProps) {
  const { className, title, progress, done, helpSection, onPrevious, onNext, onResults } = props;
  const tr = useTranslation();
  const showHelp = useShowHelp(helpSection);
  return (
    <header className={$.join(className, Styles.header)}>
      <h1>
        {progress && (
          <span>
            <b>{progress.index}</b> / {progress.count}
          </span>
        )}
        {title}
        {done && <em title={tr.done}>✓</em>}
      </h1>
      {onResults && (
        <ViewButton color="tertiary-5" onClick={onResults}>
          {tr.results}
        </ViewButton>
      )}
      {onNext && (
        <>
          <ViewButton color="secondary-5" enabled={Boolean(onPrevious)} onClick={onPrevious}>
            {tr.previous}
          </ViewButton>
          <ViewButton color="secondary-5" onClick={onNext}>
            {tr.next}
          </ViewButton>
        </>
      )}
      <ViewFloatingButton size="S" icon={IconHelp} onClick={showHelp} />
    </header>
  );
}
