import { Theme } from "@tolokoban/ui";

import { isMac } from "../platform";
import { useTranslation } from "./translation";

import Styles from "./ClickLabel.module.css";

const $ = Theme.classNames;

const MAC = isMac();

export interface ClickLabelProps {
  className?: string;
  ctrl: boolean;
  shift: boolean;
  /**
   * Name of the clicked file, `null` for a click in an empty area,
   * `undefined` for a click anywhere.
   */
  file?: string | null;
}

/** Human readable click, like "Ctrl + Maj + clic sur CV.docx". */
export function ClickLabel({ className, ctrl, shift, file }: ClickLabelProps) {
  const tr = useTranslation();
  return (
    <span className={$.join(className, Styles.clickLabel)}>
      {ctrl && <kbd>{MAC ? "⌘" : tr.ctrl}</kbd>}
      {shift && <kbd>{MAC ? "⇧" : tr.shift}</kbd>}
      <span>
        {file === undefined ? tr.click : file === null ? tr.clickEmpty : tr.clickOn$(file)}
      </span>
    </span>
  );
}
