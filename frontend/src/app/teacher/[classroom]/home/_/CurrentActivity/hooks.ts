import { INFOS } from "@/components/ActivitiesList/activities";
import { Notif } from "@/components/Notification";
import { useServiceActivityCurrent, useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { parseWrittenActivityCode } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenClassroom } from "@/service/hooks/written";

export function useCurrentActivity(classroom: string) {
  const current = useServiceActivityCurrent(classroom);
  const service = useServiceActivityCurrentSet();
  const translateError = useApiErrorTranslator();
  const code = current.data;
  const writtenId = parseWrittenActivityCode(code);
  const written = useServiceWrittenClassroom(classroom, false);
  const writtenName = written.data?.items.find((item) => item.id === writtenId)?.name;
  const clear = () => {
    if (service.isPending) return;

    service
      .mutate({ classroomCode: classroom, activityCode: null })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isLoading: current.isLoading,
    error: current.error,
    /** `undefined` while loading, `null` if there is no current activity. */
    code,
    name: code ? (INFOS[code]?.title ?? writtenName) : undefined,
    isPending: service.isPending,
    clear,
  };
}
