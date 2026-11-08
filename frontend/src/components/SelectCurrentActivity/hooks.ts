import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { useServiceActivityClear, useServiceActivityCurrentSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";

import { useTranslation } from "./translation";

/**
 * @returns A function that makes `activity` the current activity of `classroom`,
 * after asking the teacher if the answers of the students for this activity
 * must be deleted first.
 * The function resolves to `true` if the current activity has been set.
 */
export function useSelectCurrentActivity() {
  const tr = useTranslation();
  const confirm = useConfirm();
  const serviceSet = useServiceActivityCurrentSet();
  const serviceClear = useServiceActivityClear();
  const translateError = useApiErrorTranslator();
  const isPending = serviceSet.isPending || serviceClear.isPending;
  const select = async (classroom: string, activity: string): Promise<boolean> => {
    if (isPending) return false;

    const reset = await confirm({
      title: tr.title,
      content: tr.resetConfirm,
      labelOK: tr.reset,
      labelCancel: tr.keep,
      accent: true,
    });
    try {
      if (reset) {
        await serviceClear.mutate({ classroomCode: classroom, activityCode: activity });
        Notif.info(tr.cleared);
      }
      await serviceSet.mutate({ classroomCode: classroom, activityCode: activity });
      return true;
    } catch (error) {
      Notif.error(translateError(error));
      return false;
    }
  };

  return { isPending, select };
}
