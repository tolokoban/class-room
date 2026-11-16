import { Notif } from "@/components/Notification";
import { getWrittenActivityCode, WrittenClassroomItem } from "@/service/calls/written";
import { useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenUnassign } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useWrittenRow(classroom: string, item: WrittenClassroomItem) {
  const tr = useTranslation();
  const translateError = useApiErrorTranslator();
  const activating = useServiceActivityCurrentSet();
  const unassigning = useServiceWrittenUnassign();

  const activate = () => {
    activating
      .mutate({ classroomCode: classroom, activityCode: getWrittenActivityCode(item.id) })
      .then(() => Notif.info(tr.activated$(item.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  const unassign = () => {
    unassigning
      .mutate({ classroomCode: classroom, writtenId: item.id })
      .then(() => Notif.info(tr.unassigned$(item.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isActivating: activating.isPending,
    isUnassigning: unassigning.isPending,
    activate,
    unassign,
    studentUrl: `#/student/${classroom}/activity/${getWrittenActivityCode(item.id)}`,
    resultsUrl: `#/teacher/${classroom}/written/${item.id}`,
  };
}
