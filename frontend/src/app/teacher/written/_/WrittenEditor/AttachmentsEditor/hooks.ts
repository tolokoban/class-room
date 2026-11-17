import React from "react";

import { useConfirm } from "@/components/Confirm";
import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import {
  WRITTEN_MAX_ATTACHMENT_SIZE,
  WRITTEN_MAX_ATTACHMENTS,
  WrittenAttachment,
} from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenAttachmentUpload } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export interface AttachmentProgress {
  /** Name of the file being uploaded. */
  name: string;
  /** Between 0 and 1. */
  value: number;
}

export function useAttachmentsEditor(
  writtenId: number | undefined,
  attachments: WrittenAttachment[],
) {
  const tr = useTranslation();
  const formatSize = useHumanSize();
  const confirm = useConfirm();
  const translateError = useApiErrorTranslator();
  const uploading = useServiceWrittenAttachmentUpload();
  const refInput = React.useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = React.useState<AttachmentProgress | null>(null);

  /** @returns `true` if this file can be uploaded (after a confirmation to replace an existing file). */
  const check = async (file: File, names: Set<string>): Promise<boolean> => {
    if (file.size === 0) {
      Notif.error(tr.emptyFile$(file.name));
      return false;
    }
    if (file.size > WRITTEN_MAX_ATTACHMENT_SIZE) {
      Notif.error(tr.tooLarge$(file.name, formatSize(WRITTEN_MAX_ATTACHMENT_SIZE)));
      return false;
    }
    const key = file.name.toLowerCase();
    if (names.has(key)) return confirm({ content: tr.replaceConfirm$(file.name), accent: true });

    if (names.size >= WRITTEN_MAX_ATTACHMENTS) {
      Notif.error(tr.tooMany$(String(WRITTEN_MAX_ATTACHMENTS)));
      return false;
    }
    names.add(key);
    return true;
  };

  const send = async (files: File[]) => {
    if (writtenId === undefined) return;

    const names = new Set(attachments.map((attachment) => attachment.name.toLowerCase()));
    for (const file of files) {
      if (!(await check(file, names))) continue;

      setProgress({ name: file.name, value: 0 });
      try {
        await uploading.mutate({
          writtenId,
          file,
          onProgress: (value) => setProgress({ name: file.name, value }),
        });
        Notif.info(tr.uploaded$(file.name));
      } catch (error) {
        Notif.error(translateError(error));
      }
    }
    setProgress(null);
  };

  const upload = (files: File[]) => {
    // Allow to pick the same files again.
    if (refInput.current) refInput.current.value = "";
    if (files.length === 0 || progress !== null) return;

    void send(files);
  };

  return { refInput, progress, upload };
}
