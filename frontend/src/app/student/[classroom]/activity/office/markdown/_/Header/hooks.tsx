import { useModal } from "@tolokoban/ui";

import { Help } from "./Help";

/** @returns A function that opens the help, scrolled to `section`. */
export function useShowHelp(section?: string) {
  const modal = useModal();
  return () => {
    const hide = modal.show({
      content: <Help section={section} onClose={() => hide()} />,
    });
  };
}
