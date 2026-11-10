import { useModal } from "@tolokoban/ui";

import { Help } from "./Help";

export function useShowHelp() {
  const modal = useModal();
  return () => {
    const hide = modal.show({
      content: <Help onClose={() => hide()} />,
    });
  };
}
