import { isType } from "@tolokoban/type-guards";
import React from "react";

import { gotoTarget } from "@/app/routes";
import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import {
  useServiceActivityClear,
  useServiceActivityCurrent,
  useServiceActivityCurrentSet,
  useServiceActivityResultAll,
} from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceRoomStudents } from "@/service/hooks/room";
import { useTranslation } from "./translation";

/** Delay (in msec) between two reloads of the students list. */
const REFRESH_INTERVAL = 15000;

export function useQuizMenu(classroom: string, activity: string, onClose: () => void) {
  const current = useServiceActivityCurrent(classroom);
  const service = useServiceActivityCurrentSet();
  const translateError = useApiErrorTranslator();
  const select = () => {
    if (service.isPending) return;

    service
      .mutate({ classroomCode: classroom, activityCode: activity })
      .then(onClose)
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
  const results = () => {
    onClose();
    gotoTarget(null, "/teacher/[classroom]/results", classroom);
  };

  return {
    isCurrent: current.data === activity,
    /** The "select" button is hidden while we don't know the current activity. */
    canSelect: !current.isLoading && current.data !== activity,
    isPending: service.isPending,
    select,
    results,
  };
}

/**
 * @returns The students currently in `classroom`, with the number of items
 * of `activity` they have answered (at least one choice selected).
 * `hasAnswers` is `true` if at least one student has answered at least one item.
 * The list is silently reloaded every `REFRESH_INTERVAL` msec,
 * but `isLoading` is `true` during a manual `refresh()`.
 */
export function useStudentsAnswers(classroom: string, activity: string) {
  const room = useServiceRoomStudents(classroom);
  const results = useServiceActivityResultAll(classroom, activity);
  const students = (room.data ?? []).map((nickname) => {
    const result = results.data?.[nickname];
    return { nickname, count: result === undefined ? 0 : countAnswers(result) };
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const reload = () => Promise.all([room.refresh(), results.refresh()]);
  usePolling(() => void reload());
  const refresh = () => {
    setRefreshing(true);
    reload().finally(() => setRefreshing(false));
  };

  return {
    isLoading: room.isLoading || results.isLoading || refreshing,
    students,
    hasAnswers: Object.values(results.data ?? {}).some((result) => countAnswers(result) > 0),
    refresh,
  };
}

/**
 * @returns A function that deletes the answers of all the students
 * of `classroom` for `activity`, after a confirmation.
 */
export function useClearResults(classroom: string, activity: string) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const service = useServiceActivityClear();
  const translateError = useApiErrorTranslator();

  return async () => {
    if (service.isPending) return;

    const confirmed = await confirm({ content: tr.clearConfirm, accent: true });
    if (!confirmed) return;

    service
      .mutate({ classroomCode: classroom, activityCode: activity })
      .then(() => Notif.info(tr.cleared))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
}

function usePolling(refresh: () => void) {
  const ref = React.useRef(refresh);
  ref.current = refresh;
  React.useEffect(() => {
    const id = window.setInterval(() => ref.current(), REFRESH_INTERVAL);
    return () => window.clearInterval(id);
  }, []);
}

function countAnswers(result: string): number {
  try {
    const data: unknown = JSON.parse(result);
    if (isType(data, ["map", ["array", "string"]])) {
      return Object.values(data).filter((selection) => selection.length > 0).length;
    }
  } catch (error) {
    console.error("Invalid result:", result, error);
  }
  return 0;
}
