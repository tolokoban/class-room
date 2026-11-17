import { IconLink, Theme, ViewButton } from "@tolokoban/ui";

import { FileExtension } from "@/components/FileExtension";
import { HumanSize } from "@/components/HumanSize";
import { UiActionDelete } from "@/components/UiActionDelete";
import { getWrittenAttachmentUrl, WrittenAttachment } from "@/service/calls/written";

import { useAttachmentRow } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./AttachmentRow.module.css";

const $ = Theme.classNames;

export interface AttachmentRowProps {
  className?: string;
  attachment: WrittenAttachment;
}

/**
 * A file attached to a written production, with the buttons to copy its Markdown link or delete it.
 */
export function AttachmentRow({ className, attachment }: AttachmentRowProps) {
  const tr = useTranslation();
  const row = useAttachmentRow(attachment);

  return (
    <div className={$.join(className, Styles.attachmentRow)}>
      <FileExtension name={attachment.name} />
      <a href={getWrittenAttachmentUrl(attachment.id)} target="_blank" rel="noopener noreferrer">
        {attachment.name}
      </a>
      <HumanSize bytes={attachment.size} />
      <span title={tr.copyLinkHint}>
        <ViewButton variant="text" icon={IconLink} onClick={row.copyLink}>
          {tr.copyLink}
        </ViewButton>
      </span>
      <UiActionDelete
        confirm={tr.deleteConfirm$(attachment.name)}
        waiting={row.isDeleting}
        onDelete={row.remove}
      />
    </div>
  );
}
