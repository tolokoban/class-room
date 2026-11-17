import React from "react";

import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import { WrittenExpectedFile, WrittenRef } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenUpload, useServiceWrittenUploadDelete } from "@/service/hooks/written";

import { useShowPasteDialog } from "./PasteDialog";
import { useTranslation } from "./translation";

export function useUploadSlot(writtenRef: WrittenRef, computer: string, file: WrittenExpectedFile) {
  const tr = useTranslation();
  const formatSize = useHumanSize();
  const translateError = useApiErrorTranslator();
  const uploading = useServiceWrittenUpload();
  const deleting = useServiceWrittenUploadDelete();
  const refInput = React.useRef<HTMLInputElement | null>(null);
  /** Between 0 and 1 while uploading, `null` otherwise. */
  const [progress, setProgress] = React.useState<number | null>(null);

  const showPasteDialog = useShowPasteDialog();
  const pasteMime = getPasteMime(file.mimeTypes);

  const send = async (picked: File) => {
    if (picked.size === 0) {
      Notif.error(tr.emptyFile$(picked.name));
      return;
    }
    if (picked.size > file.maxSize) {
      Notif.error(tr.tooLarge$(picked.name, formatSize(file.maxSize)));
      return;
    }
    setProgress(0);
    try {
      await uploading.mutate({
        ...writtenRef,
        computer,
        slot: file.name,
        file: picked,
        onProgress: setProgress,
      });
      Notif.info(tr.uploaded$(picked.name));
    } catch (error) {
      Notif.error(translateError(error));
    } finally {
      setProgress(null);
    }
  };

  const upload = ([picked]: File[]) => {
    // Allow to pick the same file again.
    if (refInput.current) refInput.current.value = "";
    if (!picked || progress !== null) return;

    void send(picked);
  };

  const paste = async () => {
    if (!pasteMime || progress !== null) return;

    let content: string;
    try {
      content = await navigator.clipboard.readText();
    } catch {
      Notif.error(tr.clipboardDenied);
      return;
    }
    if (content.trim().length === 0) {
      Notif.error(tr.clipboardEmpty);
      return;
    }
    if (!(await showPasteDialog(content))) return;

    const extension = pasteMime === "text/markdown" ? "md" : "txt";
    await send(new File([content], `${file.name}.${extension}`, { type: pasteMime }));
  };

  const remove = () => {
    deleting
      .mutate({ ...writtenRef, computer, slot: file.name })
      .then(() => Notif.info(tr.deleted$(file.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    maxSize: tr.maxSize$(formatSize(file.maxSize)),
    refInput,
    progress,
    isDeleting: deleting.isPending,
    upload,
    /** `undefined` if the expected file cannot be text or Markdown. */
    paste: pasteMime ? () => void paste() : undefined,
    remove,
  };
}

/**
 * @returns The mime type to use for a clipboard content,
 * or `null` if the expected file can be neither Markdown nor plain text.
 */
function getPasteMime(mimeTypes: string[]): "text/markdown" | "text/plain" | null {
  if (mimeTypes.includes("text/markdown")) return "text/markdown";
  if (mimeTypes.includes("text/plain")) return "text/plain";
  return null;
}
