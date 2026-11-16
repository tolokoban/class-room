import React from "react";

import { Notif } from "@/components/Notification";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenAssign, useServiceWrittenList } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useAssignWritten(classroom: string, assigned: number[]) {
  const tr = useTranslation();
  const translateError = useApiErrorTranslator();
  const list = useServiceWrittenList();
  const assigning = useServiceWrittenAssign();
  const options = (list.data ?? []).filter((item) => !assigned.includes(item.id));
  const [selected, setSelected] = React.useState("");
  // The selection must always be one of the options.
  const value = options.some((item) => `${item.id}` === selected)
    ? selected
    : `${options[0]?.id ?? ""}`;

  const assign = () => {
    const item = options.find((option) => `${option.id}` === value);
    if (!item) return;

    assigning
      .mutate({ classroomCode: classroom, writtenId: item.id })
      .then(() => Notif.info(tr.assigned$(item.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isLoading: list.isLoading,
    options,
    value,
    setValue: setSelected,
    isPending: assigning.isPending,
    assign,
  };
}
