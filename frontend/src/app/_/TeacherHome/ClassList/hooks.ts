import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { ClassItem } from "@/service/calls/class";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceClassDelete } from "@/service/hooks/class";

import { useTranslation } from "../translation";

export function useClassDelete() {
  const tr = useTranslation();
  const confirm = useConfirm();
  const service = useServiceClassDelete();
  const translateError = useApiErrorTranslator();

  return async (classroom: ClassItem) => {
    if (service.isPending) return;

    const confirmed = await confirm({ content: tr.deleteConfirm, accent: true });
    if (!confirmed) return;

    service
      .mutate({ id: classroom.id })
      .then(() => Notif.info(tr.deleted$(classroom.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
}
