import { Theme, ViewDialog } from "@tolokoban/ui";

import { Md } from "@/components/Md";

import { useTranslation } from "./translation";

import Styles from "./PasteDialog.module.css";

const $ = Theme.classNames;

export interface PasteDialogProps {
  className?: string;
  /** Content of the clipboard. */
  value: string;
  onCancel(): void;
  onUpload(): void;
}

/**
 * Preview of the clipboard content, before uploading it as the expected file.
 */
export function PasteDialog({ className, value, onCancel, onUpload }: PasteDialogProps) {
  const tr = useTranslation();

  return (
    <ViewDialog
      className={$.join(className, Styles.pasteDialog)}
      title={tr.title}
      buttonCancel={{ children: tr.cancel, onClick: onCancel }}
      buttonValidate={{ children: tr.upload, onClick: onUpload }}
    >
      <Md value={value} />
    </ViewDialog>
  );
}
