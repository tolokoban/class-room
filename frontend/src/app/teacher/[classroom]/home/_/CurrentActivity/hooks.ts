import { INFOS } from "@/components/ActivitiesList/activities";
import { Notif } from "@/components/Notification";
import { useServiceActivityCurrent, useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";

export function useCurrentActivity(classroom: string) {
  const current = useServiceActivityCurrent(classroom);
  const service = useServiceActivityCurrentSet();
  const translateError = useApiErrorTranslator();
  const code = current.data;
  const clear = () => {
    if (service.isPending) return;

    service.mutate({ classroomCode: classroom, activityCode: null }).catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isLoading: current.isLoading,
    error: current.error,
    /** `undefined` while loading, `null` if there is no current activity. */
    code,
    name: code ? INFOS[code]?.title : undefined,
    isPending: service.isPending,
    clear,
  };
}
