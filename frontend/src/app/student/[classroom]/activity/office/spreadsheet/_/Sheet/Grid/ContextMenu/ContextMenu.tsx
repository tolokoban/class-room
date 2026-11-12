import { Theme } from "@tolokoban/ui";
import type React from "react";

import Styles from "./ContextMenu.module.css";

const $ = Theme.classNames;

export interface ContextMenuItem {
  label: string;
  onClick(): void;
}

export interface ContextMenuProps {
  className?: string;
  /** Position of the menu, in viewport coordinates. */
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose(): void;
}

/** Menu shown on right click, closed by clicking anywhere else. */
export function ContextMenu({ className, x, y, items, onClose }: ContextMenuProps) {
  const close = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    onClose();
  };
  return (
    <div
      className={$.join(className, Styles.contextMenu)}
      onPointerDown={close}
      onContextMenu={close}
    >
      <menu style={{ left: x, top: y }} onPointerDown={(evt) => evt.stopPropagation()}>
        {items.map(({ label, onClick }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onClick();
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </menu>
    </div>
  );
}
