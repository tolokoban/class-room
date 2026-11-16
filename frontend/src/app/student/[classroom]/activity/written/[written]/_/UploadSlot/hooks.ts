import React from "react";

import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import { WrittenExpectedFile, WrittenRef } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenUpload, useServiceWrittenUploadDelete } from "@/service/hooks/written";

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

  const upload = async ([picked]: File[]) => {
    // Allow to pick the same file again.
    if (refInput.current) refInput.current.value = "";
    if (!picked || progress !== null) return;

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
    upload: (files: File[]) => void upload(files),
    remove,
  };
}
