import React from "react";

import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { WrittenRef, WrittenTimerAction } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenTimer } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useTimerPanel(writtenRef: WrittenRef) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const translateError = useApiErrorTranslator();
  const service = useServiceWrittenTimer();
  const [minutes, setMinutes] = React.useState(5);

  const run = (action: WrittenTimerAction, value?: number) => {
    service
      .mutate({ ...writtenRef, action, value })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
  const runAfterConfirm = (action: WrittenTimerAction, content: string, accent: boolean) => {
    void confirm({ content, accent }).then((confirmed) => confirmed && run(action));
  };

  return {
    isPending: service.isPending,
    minutes,
    setMinutes,
    start: () => runAfterConfirm("start", tr.startReminder, false),
    pause: () => run("pause"),
    resume: () => run("resume"),
    add: () => run("add", minutes),
    reset: () => runAfterConfirm("reset", tr.resetConfirm, true),
  };
}
