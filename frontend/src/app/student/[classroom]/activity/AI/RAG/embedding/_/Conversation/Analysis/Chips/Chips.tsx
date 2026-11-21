import { Theme, ViewTooltip } from "@tolokoban/ui";

import Styles from "./Chips.module.css";

const $ = Theme.classNames;

export interface Chip {
  text: string;
  /** Name of the CSS class that gives its color: "verb", "subject"… `null` for no highlight. */
  kind: string | null;
  tooltip?: string;
}

export interface ChipsProps {
  className?: string;
  chips: Chip[];
}

/** A sentence cut in highlighted pieces, each with a tooltip. */
export function Chips({ className, chips }: ChipsProps) {
  return (
    <div className={$.join(className, Styles.chips)}>
      {chips.map(({ text, kind, tooltip }, index) => (
        <ViewTooltip
          key={index}
          className={$.join(kind && Styles[kind])}
          content={tooltip}
          color="neutral-1"
        >
          {text}
        </ViewTooltip>
      ))}
    </div>
  );
}
