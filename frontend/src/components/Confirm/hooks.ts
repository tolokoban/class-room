import { type ConfirmParams, useModal } from "@tolokoban/ui";

import { useTranslation } from "./translation";

/**
 * Same as `modal.confirm()`, but with translated captions for the buttons,
 * instead of the content of the dialog for "OK" and "Cancel" in English.
 */
export function useConfirm() {
  const tr = useTranslation();
  const modal = useModal();
  return (params: ConfirmParams) =>
    modal.confirm({ labelOK: tr.confirm, labelCancel: tr.cancel, ...params });
}
