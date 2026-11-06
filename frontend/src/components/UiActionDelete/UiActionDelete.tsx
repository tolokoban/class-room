import { IconDelete, Theme, ViewButton } from "@tolokoban/ui";

import { useActionDelete } from "./hooks";

import Styles from "./UiActionDelete.module.css";

const $ = Theme.classNames;

export interface UiActionDeleteProps {
  className?: string;
  /** Question displayed in the confirmation dialog. */
  confirm: React.ReactNode;
  /** Called only once the user has confirmed the deletion. */
  onDelete(this: void): void;
  /** If `true`, the icon spins and the button is disabled. */
  waiting?: boolean;
}

/**
 * Icon button to delete something, after a confirmation.
 */
export function UiActionDelete({ className, confirm, onDelete, waiting }: UiActionDeleteProps) {
  const handleClick = useActionDelete(confirm, onDelete);

  return (
    <ViewButton
      className={$.join(className, Styles.uiActionDelete)}
      variant="text"
      color="error"
      label=""
      icon={IconDelete}
      waiting={waiting}
      onClick={handleClick}
    />
  );
}
