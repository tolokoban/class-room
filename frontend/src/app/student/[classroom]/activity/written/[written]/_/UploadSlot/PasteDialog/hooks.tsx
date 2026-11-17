import { useModal } from "@tolokoban/ui";

import { PasteDialog } from "./PasteDialog";

/**
 * @returns A function that shows the clipboard content in a modal
 * and resolves to `true` if the student wants to upload it.
 */
export function useShowPasteDialog() {
  const modal = useModal();
  return (value: string) =>
    new Promise<boolean>((resolve) => {
      const close = (confirmed: boolean) => {
        hide();
        resolve(confirmed);
      };
      const hide = modal.show({
        autoClosable: false,
        content: (
          <PasteDialog value={value} onCancel={() => close(false)} onUpload={() => close(true)} />
        ),
      });
    });
}
