import { Theme, ViewButton } from "@tolokoban/ui";

import { type Cells } from "../Sheet/engine/address";
import { useCopyButton } from "./hooks";

import Styles from "./CopyButton.module.css";

const $ = Theme.classNames;

export interface CopyButtonProps {
  className?: string;
  cells: Cells;
}

/**
 * Teachers only: copy the sheet to the clipboard, in the format of `exercises.ts`.
 */
export function CopyButton({ className, cells }: CopyButtonProps) {
  const { tr, visible, handleCopy } = useCopyButton(cells);
  if (!visible) return null;

  return (
    <ViewButton
      className={$.join(className, Styles.copyButton)}
      color="tertiary-5"
      onClick={handleCopy}
    >
      {tr.copy}
    </ViewButton>
  );
}
