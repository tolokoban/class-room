import React from "react";

import { type KeyStroke } from "../keyboard";
import { isMac, toKeyStroke } from "../platform";

const MAC = isMac();

/** Pressing only these keys does not count as a keystroke. */
const MODIFIERS = new Set(["Shift", "Control", "Alt", "AltGraph", "Meta", "CapsLock", "Dead"]);

export function useEditorHandlers(focusKey: unknown, onKeyStroke: (stroke: KeyStroke) => boolean) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, [focusKey]);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (MODIFIERS.has(event.key)) return;
    // Let the browser move the focus out of the editor.
    if (event.key === "Tab") return;

    if (onKeyStroke(toKeyStroke(event, MAC))) event.preventDefault();
  };
  // The mouse can only give the focus: it cannot move the cursor.
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.focus();
  };
  return { ref, handleKeyDown, handleMouseDown };
}
