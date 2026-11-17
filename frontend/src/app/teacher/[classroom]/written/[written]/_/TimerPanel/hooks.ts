import React from "react";

import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { getWrittenActivityCode, WrittenRef, WrittenTimerAction } from "@/service/calls/written";
import { useServiceActivityCurrent, useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenTimer } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useTimerPanel(writtenRef: WrittenRef, defaultDuration: number) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const translateError = useApiErrorTranslator();
  const service = useServiceWrittenTimer();
  const activityCode = getWrittenActivityCode(writtenRef.writtenId);
  const current = useServiceActivityCurrent(writtenRef.classroomCode);
  const activating = useServiceActivityCurrentSet();
  const [minutes, setMinutes] = React.useState(5);
  const [duration, setDuration] = React.useState(defaultDuration);

  const run = (action: WrittenTimerAction, value?: number) => {
    service
      .mutate({ ...writtenRef, action, value })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
  const runAfterConfirm = (
    action: WrittenTimerAction,
    content: string,
    accent: boolean,
    value?: number,
  ) => {
    void confirm({ content, accent }).then((confirmed) => confirmed && run(action, value));
  };

  const launch = () => {
    activating
      .mutate({ classroomCode: writtenRef.classroomCode, activityCode })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isPending: service.isPending,
    /** `undefined` while loading. */
    isCurrent: current.data === undefined ? undefined : current.data === activityCode,
    isLaunching: activating.isPending,
    launch,
    minutes,
    setMinutes,
    duration,
    setDuration,
    // start: () => runAfterConfirm("start", tr.startReminder, false, duration),
    start: () => run("start", duration),
    pause: () => run("pause"),
    resume: () => run("resume"),
    add: () => run("add", minutes),
    reset: () => runAfterConfirm("reset", tr.resetConfirm, true),
  };
}
