import { useModal } from "@tolokoban/ui";
import React from "react";

import { Help } from "./Help";

/**
 * Give a function that opens the help in a modal, scrolled to `section`,
 * and open it as well when the key F1 is pressed.
 * Calling the function while the help is already open does nothing.
 * Beware: F1 is listened on the whole window as long as the component is mounted,
 * so use this hook in only one mounted component at a time.
 * @returns A function that opens the help, scrolled to `section`.
 */
export function useShowHelp(section?: string) {
  const modal = useModal();
  const open = React.useRef(false);
  const showHelp = () => {
    if (open.current) return;

    open.current = true;
    const handleClose = () => {
      open.current = false;
    };
    const hide = modal.show({
      content: (
        <Help
          section={section}
          onClose={() => {
            handleClose();
            hide();
          }}
        />
      ),
      onClose: handleClose,
    });
  };
  useKey("F1", showHelp);
  return showHelp;
}

/**
 * Call `action` when `key` is pressed anywhere in the window,
 * instead of the default behaviour of the browser.
 * Beware: the key is caught in the capture phase and its propagation is stopped,
 * so no other element (editor, input…) will receive it.
 */
function useKey(key: string, action: () => void) {
  const refAction = React.useRef(action);
  refAction.current = action;
  React.useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.key !== key) return;

      evt.preventDefault();
      evt.stopPropagation();
      refAction.current();
    };
    // Capture phase, so that the editors cannot swallow the key.
    globalThis.addEventListener("keydown", handleKeyDown, true);
    return () => globalThis.removeEventListener("keydown", handleKeyDown, true);
  }, [key]);
}
