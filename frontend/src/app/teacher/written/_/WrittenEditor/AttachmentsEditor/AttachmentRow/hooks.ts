import { Notif } from "@/components/Notification";
import { getWrittenAttachmentLink, WrittenAttachment } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenAttachmentDelete } from "@/service/hooks/written";

import { useTranslation } from "./translation";

export function useAttachmentRow(attachment: WrittenAttachment) {
  const tr = useTranslation();
  const translateError = useApiErrorTranslator();
  const deleting = useServiceWrittenAttachmentDelete();

  const copyLink = () => {
    const link = getWrittenAttachmentLink(attachment.name);
    navigator.clipboard
      .writeText(link)
      .then(() => Notif.info(tr.linkCopied$(link)))
      .catch(() => Notif.error(tr.clipboardDenied));
  };

  const remove = () => {
    deleting
      .mutate({ attachmentId: attachment.id })
      .then(() => Notif.info(tr.deleted$(attachment.name)))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return { copyLink, remove, isDeleting: deleting.isPending };
}
