import { useRouteParamAsString } from "@/app/routes";
import { Notif } from "@/components/Notification";
import { useServiceActivityCurrent, useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";

export function useActivateButton(activity: string) {
  const classroom = useRouteParamAsString("classroom");
  const current = useServiceActivityCurrent(classroom);
  const service = useServiceActivityCurrentSet();
  const translateError = useApiErrorTranslator();
  const activate = () => {
    if (service.isPending) return;

    service
      .mutate({ classroomCode: classroom, activityCode: activity })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isLoading: current.isLoading,
    isCurrent: current.data === activity,
    isPending: service.isPending,
    activate,
  };
}
