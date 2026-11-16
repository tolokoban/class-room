import { useLangValue } from "@tolokoban/react-state";
import React from "react";

import { Notif } from "@/components/Notification";
import { WrittenRef, WrittenTimer } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenTimer } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useExpirationPanel(
  writtenRef: WrittenRef,
  timer: WrittenTimer,
  expiration: number,
  now: number,
) {
  const tr = useTranslation();
  const lang = useLangValue();
  const translateError = useApiErrorTranslator();
  const service = useServiceWrittenTimer();
  const [hours, setHours] = React.useState(24);

  const extend = () => {
    service
      .mutate({ ...writtenRef, action: "extend", value: hours })
      .then(() => Notif.info(tr.extended$(String(hours))))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    message: getMessage(timer, expiration, now, tr, lang),
    canExtend: timer.state !== "idle",
    hours,
    setHours,
    isPending: service.isPending,
    extend,
  };
}

function getMessage(
  timer: WrittenTimer,
  expiration: number,
  now: number,
  tr: ReturnType<typeof useTranslation>,
  lang: string,
): string {
  if (timer.expiresAt === null) return tr.notStarted$(String(expiration));

  const date = new Date(timer.expiresAt * 1000).toLocaleString(lang, {
    dateStyle: "full",
    timeStyle: "short",
  });
  return timer.expiresAt <= now ? tr.expired$(date) : tr.expiresAt$(date);
}
