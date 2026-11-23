import { useLangValue } from "@tolokoban/react-state";
import React from "react";

import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceRoomKick, useServiceRoomSeats } from "@/service/hooks/room";

import { useTranslation } from "./translation";

export function useSeatsList(classroom: string) {
  const tr = useTranslation();
  const lang = useLangValue();
  const translateError = useApiErrorTranslator();
  const query = useServiceRoomSeats(classroom);
  const kicking = useServiceRoomKick();
  const confirm = useConfirm();
  const [expanded, setExpanded] = React.useState(false);

  const kick = (nickname?: string) => {
    kicking
      .mutate({ classroomCode: classroom, nickname })
      .then((count) => Notif.info(nickname ? tr.kicked$(nickname) : tr.kickedAll$(String(count))))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    ...query,
    expanded,
    toggle: () => setExpanded(!expanded),
    kickAfterConfirm: (content: string, nickname?: string) =>
      void confirm({ content, accent: true }).then((ok) => ok && kick(nickname)),
    isKicking: kicking.isPending,
    kick,
    formatTime: (time: number) =>
      new Date(time * 1000).toLocaleString(lang, { dateStyle: "short", timeStyle: "short" }),
  };
}
