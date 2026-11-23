import React from "react";

import { Notif } from "@/components/Notification";
import { isReservedFileName } from "@/service/calls/file";
import { useServiceFileList } from "@/service/hooks/file";

import { useTranslation } from "./translation";
import { useFileUploader } from "./UploadProgress";

/**
 * Files of a class room, and the upload of new ones (one at a time, with a progress bar).
 */
export function useClassroomFiles(classroom: string) {
  const tr = useTranslation();
  const list = useServiceFileList(classroom);
  const uploader = useFileUploader();
  const refInput = React.useRef<HTMLInputElement | null>(null);

  const add = async (files: File[]) => {
    // Allow to pick the same file again.
    if (refInput.current) refInput.current.value = "";
    for (const file of files) {
      if (isReservedFileName(file.name)) {
        Notif.error(tr.reservedName$(file.name));
        continue;
      }
      const name = file.name.toLowerCase();
      if (list.data?.some((item) => item.name.toLowerCase() === name)) {
        Notif.error(tr.nameUsed$(file.name));
        continue;
      }
      if (await uploader.upload({ classroomCode: classroom }, file)) {
        Notif.info(tr.added$(file.name));
      }
    }
  };

  return {
    ...list,
    /** Progress of the file being added, or `null`. */
    progress: uploader.progress,
    refInput,
    add: (files: File[]) => void add(files),
  };
}
