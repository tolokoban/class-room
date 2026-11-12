import { IconChevronDown, IconChevronRight, Theme } from "@tolokoban/ui";

import Styles from "./SectionHeader.module.css";

const $ = Theme.classNames;

export interface SectionHeaderProps {
  className?: string;
  /** Title of the section. */
  children: React.ReactNode;
  /** Is the section currently expanded? */
  expanded: boolean;
  /** Called when the user clicks the header. */
  onToggle(): void;
}

/**
 * Clickable header of a collapsible section.
 */
export function SectionHeader({ className, children, expanded, onToggle }: SectionHeaderProps) {
  const Icon = expanded ? IconChevronDown : IconChevronRight;

  return (
    <header className={$.join(className, Styles.sectionHeader)}>
      <button type="button" aria-expanded={expanded} onClick={onToggle}>
        <Icon />
        <span>{children}</span>
      </button>
    </header>
  );
}
