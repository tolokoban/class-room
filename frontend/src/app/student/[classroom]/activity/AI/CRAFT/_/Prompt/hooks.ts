import React from "react";

import { Notif } from "@/components/Notification/manager";
import { useTranslation } from "./translation";

export function useCopyHandler(text: string) {
  const tr = useTranslation();
  return React.useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => Notif.info(tr.copied),
      () => Notif.error(tr.copyFailed),
    );
  }, [text, tr]);
}
