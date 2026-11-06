import { useLangValue } from "@tolokoban/react-state";
import React from "react";

import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { FileItem, getFileMime, readFileAsDataUrl } from "@/service/calls/file";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceFileDelete, useServiceFileReplace } from "@/service/hooks/file";

import { useTranslation } from "./translation";

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

export function useFileRow(file: FileItem) {
  const translateError = useApiErrorTranslator();
  const replacing = useServiceFileReplace();
  const deleting = useServiceFileDelete();

  return {
    size: useHumanFriendlySize(file.size),
    // "application/octet-stream" would hide the files without a known type.
    accept: file.mime === "application/octet-stream" ? undefined : file.mime,
    isReplacing: replacing.isPending,
    isDeleting: deleting.isPending,
    ...useFileReplace(file, replacing.mutate, translateError),
    remove: useFileDelete(file, deleting.mutate, translateError),
  };
}

function useFileReplace(
  file: FileItem,
  mutate: ReturnType<typeof useServiceFileReplace>["mutate"],
  translateError: ReturnType<typeof useApiErrorTranslator>,
) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const refInput = React.useRef<HTMLInputElement | null>(null);

  const replace = async ([picked]: File[]) => {
    // Allow to pick the same file again.
    if (refInput.current) refInput.current.value = "";
    if (!picked) return;

    if (getFileMime(picked) !== file.mime) {
      Notif.error(tr.mimeMismatch$(picked.name, file.name));
      return;
    }
    if (!(await confirm({ content: tr.replaceConfirm$(file.name, picked.name), accent: true })))
      return;

    try {
      const content = await readFileAsDataUrl(picked);
      await mutate({ fileId: file.id, name: picked.name, file: content });
      Notif.info(tr.replaced$(file.name));
    } catch (error) {
      Notif.error(translateError(error));
    }
  };

  return { refInput, replace: (files: File[]) => void replace(files) };
}

function useFileDelete(
  file: FileItem,
  mutate: ReturnType<typeof useServiceFileDelete>["mutate"],
  translateError: ReturnType<typeof useApiErrorTranslator>,
) {
  const tr = useTranslation();

  return () => {
    mutate({ fileId: file.id })
      .then(() => Notif.info(tr.deleted$(file.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
}

/**
 * Size in bytes, KB, MB or GB, depending on its magnitude.
 */
function useHumanFriendlySize(bytes: number): string {
  const tr = useTranslation();
  const lang = useLangValue();
  const format = (value: number) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(value);

  if (bytes < KB) return tr.sizeB$(format(bytes));
  if (bytes < MB) return tr.sizeKB$(format(bytes / KB));
  if (bytes < GB) return tr.sizeMB$(format(bytes / MB));
  return tr.sizeGB$(format(bytes / GB));
}
