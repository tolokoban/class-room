import { IconMove, Theme } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./DragHandle.module.css";

const $ = Theme.classNames;

/** Events used to reorder the list by dragging the handle (or with the arrow keys). */
export type DragHandleEvents = Pick<
  React.HTMLAttributes<HTMLElement>,
  "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel" | "onKeyDown"
>;

export interface DragHandleProps extends DragHandleEvents {
  className?: string;
}

/**
 * The area of a card the user grabs to change its position in the list.
 */
export function DragHandle({ className, ...events }: DragHandleProps) {
  const tr = useTranslation();

  return (
    <div
      className={$.join(className, Styles.dragHandle)}
      role="button"
      tabIndex={0}
      title={tr.reorder}
      aria-label={tr.reorder}
      {...events}
    >
      <IconMove />
    </div>
  );
}
