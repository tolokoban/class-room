import React from "react";

import { Notif } from "@/components/Notification";
import { readFileAsDataUrl } from "@/service/calls/file";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceFileAdd, useServiceFileList } from "@/service/hooks/file";

import { useTranslation } from "./translation";

export function useClassroomFiles(classroom: string) {
  const tr = useTranslation();
  const list = useServiceFileList(classroom);
  const service = useServiceFileAdd();
  const translateError = useApiErrorTranslator();
  const refInput = React.useRef<HTMLInputElement | null>(null);

  const add = async (files: File[]) => {
    // Allow to pick the same file again.
    if (refInput.current) refInput.current.value = "";
    for (const file of files) {
      const name = file.name.toLowerCase();
      if (list.data?.some((item) => item.name.toLowerCase() === name)) {
        Notif.error(tr.nameUsed$(file.name));
        continue;
      }
      try {
        const content = await readFileAsDataUrl(file);
        await service.mutate({ classroomCode: classroom, name: file.name, file: content });
        Notif.info(tr.added$(file.name));
      } catch (error) {
        Notif.error(translateError(error));
      }
    }
  };

  return {
    ...list,
    isPending: service.isPending,
    refInput,
    add: (files: File[]) => void add(files),
  };
}
