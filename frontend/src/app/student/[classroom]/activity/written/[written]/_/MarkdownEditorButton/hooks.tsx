import { useModal } from "@tolokoban/ui";

import { MarkdownEditor } from "./MarkdownEditor";

/** @returns A function that opens the Markdown editor in a full screen modal. */
export function useShowMarkdownEditor(writtenId: number) {
  const modal = useModal();
  return () => {
    const hide = modal.show({
      // ESC closes the modal.
      autoClosable: true,
      padding: 0,
      content: (
        <MarkdownEditor storageKey={`written/${writtenId}/markdown`} onClose={() => hide()} />
      ),
    });
  };
}
