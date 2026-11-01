import { gotoTarget } from "@/app/routes";
import { isRoutePath } from "@/app/types";
import { Notif } from "@/components/Notification";
import { useServiceActivityCurrent, useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";

export function useActivityMenu(classroom: string, activity: string, onClose: () => void) {
  const current = useServiceActivityCurrent(classroom);
  const service = useServiceActivityCurrentSet();
  const translateError = useApiErrorTranslator();
  const isCurrent = current.data === activity;
  const open = () => {
    const route = `/student/[classroom]/activity/${activity}`;
    if (!isRoutePath(route)) return;

    onClose();
    gotoTarget(null, route, classroom);
  };
  const toggle = () => {
    if (service.isPending) return;

    service
      .mutate({ classroomCode: classroom, activityCode: isCurrent ? null : activity })
      .then(onClose)
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
  const results = () => {
    onClose();
    gotoTarget(null, "/teacher/[classroom]/results", classroom);
  };

  return {
    isCurrent,
    isLoading: current.isLoading,
    isPending: service.isPending,
    open,
    results,
    toggle,
  };
}
