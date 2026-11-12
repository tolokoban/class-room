import { useModal } from "@tolokoban/ui";

import { CopyForbidden } from "./CopyForbidden";

/** Returns a function that opens the "copy forbidden" modal. */
export function useShowCopyForbidden() {
  const modal = useModal();
  return () => {
    const hide = modal.show({
      autoClosable: false,
      content: <CopyForbidden onClose={() => hide()} />,
    });
  };
}
