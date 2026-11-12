import { Theme } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./InvisiblesToggle.module.css";

const $ = Theme.classNames;

export interface InvisiblesToggleProps {
  className?: string;
  value: boolean;
  onChange(value: boolean): void;
}

/**
 * Pilcrow button to show/hide the invisible characters (spaces, tabs, line breaks).
 */
export function InvisiblesToggle({ className, value, onChange }: InvisiblesToggleProps) {
  const tr = useTranslation();
  return (
    <button
      type="button"
      className={$.join(className, Styles.invisiblesToggle)}
      title={value ? tr.hide : tr.show}
      aria-pressed={value}
      // Do not steal the focus from the editor.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onChange(!value)}
    >
      ¶
    </button>
  );
}
