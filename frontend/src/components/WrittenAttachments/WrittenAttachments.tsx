import { Theme } from "@tolokoban/ui";

import { FileExtension } from "@/components/FileExtension";
import { HumanSize } from "@/components/HumanSize";
import { getWrittenAttachmentUrl, WrittenAttachment } from "@/service/calls/written";

import { useTranslation } from "./translation";

import Styles from "./WrittenAttachments.module.css";

const $ = Theme.classNames;

export interface WrittenAttachmentsProps {
  className?: string;
  /** Files attached by the teacher to a written production. */
  attachments: WrittenAttachment[];
  /** Needed by the students to download the files (not by the owner of the written production). */
  classroomCode?: string;
}

/**
 * Section "Documents": the files attached by the teacher to a written production.
 * Nothing is displayed if there is no attachment.
 */
export function WrittenAttachments({
  className,
  attachments,
  classroomCode,
}: WrittenAttachmentsProps) {
  const tr = useTranslation();

  if (attachments.length === 0) return null;

  return (
    <section className={$.join(className, Styles.writtenAttachments)}>
      <header>{tr.title}</header>
      <ul>
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            <a
              href={getWrittenAttachmentUrl(attachment.id, classroomCode)}
              target="_blank"
              rel="noopener noreferrer"
              title={tr.download$(attachment.name)}
            >
              <FileExtension name={attachment.name} />
              <span>{attachment.name}</span>
              <HumanSize bytes={attachment.size} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
