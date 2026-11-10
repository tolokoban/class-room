import type React from "react";

import { type Click } from "../../explorer";
import { useTranslation } from "./translation";

export function useFileList(onClick: ((click: Click) => void) | undefined) {
  const tr = useTranslation();
  return {
    tr,
    /** `file` is `null` for a click in the empty area of the list. */
    handleClick: (file: number | null) => (event: React.MouseEvent) => {
      event.stopPropagation();
      // On a Mac, ⌘ plays the role of Ctrl.
      onClick?.({ file, ctrl: event.ctrlKey || event.metaKey, shift: event.shiftKey });
    },
  };
}
