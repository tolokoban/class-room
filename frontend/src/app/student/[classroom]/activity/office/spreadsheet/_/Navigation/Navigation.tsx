import { IconArrowLeft, IconArrowRight, Theme, ViewFloatingButton } from "@tolokoban/ui";

import Styles from "./Navigation.module.css";

const $ = Theme.classNames;

export interface NavigationProps {
  className?: string;
  /** `false` on the first exercise: the "previous" button is hidden. */
  canGoPrevious: boolean;
  /** The "next" button is enabled only once the current exercise has been solved (always for a teacher). */
  canGoNext: boolean;
  handlePrevious(): void;
  handleNext(): void;
}

/** Floating buttons to move to the previous or to the next exercise. */
export function Navigation({
  className,
  canGoPrevious,
  canGoNext,
  handlePrevious,
  handleNext,
}: NavigationProps) {
  return (
    <nav className={$.join(className, Styles.navigation)}>
      {canGoPrevious && (
        <ViewFloatingButton size="S" icon={IconArrowLeft} onClick={handlePrevious} />
      )}
      <ViewFloatingButton size="S" icon={IconArrowRight} enabled={canGoNext} onClick={handleNext} />
    </nav>
  );
}
