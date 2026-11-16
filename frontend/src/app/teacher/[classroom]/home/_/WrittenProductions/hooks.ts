import { goto } from "@/app/routes";
import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import { useServiceActivityCurrent } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenClassroom, useServiceWrittenFilesDelete } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useWrittenProductions(classroom: string, expanded: boolean) {
  const tr = useTranslation();
  const formatSize = useHumanSize();
  const translateError = useApiErrorTranslator();
  // Only refreshed regularly while the section is visible.
  const query = useServiceWrittenClassroom(classroom, expanded ? 10000 : false);
  const current = useServiceActivityCurrent(classroom);
  const deleting = useServiceWrittenFilesDelete();
  const items = query.data?.items ?? [];
  const count = items.reduce((total, item) => total + item.count, 0);
  const size = items.reduce((total, item) => total + item.size, 0);

  const deleteAll = () => {
    deleting
      .mutate({ classroomCode: classroom })
      .then((deleted) => Notif.info(tr.deletedAll$(String(deleted))))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    ...query,
    items,
    currentActivity: current.data,
    total: tr.total$(String(count), formatSize(size)),
    hasFiles: count > 0,
    isDeleting: deleting.isPending,
    deleteAll,
    manage: () => goto("/teacher/written"),
  };
}
