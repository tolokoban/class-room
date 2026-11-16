import React from "react";

import { Notif } from "@/components/Notification";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceClassList, useServiceClassUpdate } from "@/service/hooks/class";

import { useTranslation } from "./translation";

export function useMaxStudents(classroom: string) {
  const tr = useTranslation();
  const translateError = useApiErrorTranslator();
  const list = useServiceClassList();
  const service = useServiceClassUpdate();
  const item = list.data?.find((current) => current.code === classroom);
  const [value, setValue] = React.useState<number | null>(null);
  const maxStudents = value ?? item?.maxStudents ?? 24;

  const save = () => {
    if (!item) return;

    service
      .mutate({ id: item.id, maxStudents })
      .then(() => {
        setValue(null);
        Notif.info(tr.saved$(String(maxStudents)));
      })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isReady: item !== undefined,
    maxStudents,
    setMaxStudents: setValue,
    isModified: item !== undefined && maxStudents !== item.maxStudents,
    isPending: service.isPending,
    save,
  };
}
