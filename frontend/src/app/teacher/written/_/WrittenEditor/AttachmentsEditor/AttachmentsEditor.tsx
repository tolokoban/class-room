import { IconImport, Theme, ViewInputFile, ViewProgress } from "@tolokoban/ui";

import { WrittenAttachment, WRITTEN_MAX_ATTACHMENTS } from "@/service/calls/written";

import { AttachmentRow } from "./AttachmentRow";
import { useAttachmentsEditor } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./AttachmentsEditor.module.css";

const $ = Theme.classNames;

export interface AttachmentsEditorProps {
  className?: string;
  /** ID of the written production, or `undefined` if it has not been saved yet. */
  writtenId?: number;
  attachments: WrittenAttachment[];
}

/**
 * Files attached by the teacher to a written production, that the students can download.
 * They are uploaded immediately: they are not part of the draft of the editor.
 */
export function AttachmentsEditor({ className, writtenId, attachments }: AttachmentsEditorProps) {
  const tr = useTranslation();
  const editor = useAttachmentsEditor(writtenId, attachments);
  const isUploading = editor.progress !== null;

  return (
    <div className={$.join(className, Styles.attachmentsEditor)}>
      <h2>{tr.title}</h2>
      <p>{tr.hint}</p>
      {writtenId === undefined ? (
        <p>
          <em>{tr.saveFirst}</em>
        </p>
      ) : (
        <>
          {attachments.map((attachment) => (
            <AttachmentRow key={attachment.id} attachment={attachment} />
          ))}
          {editor.progress && (
            <div className={Styles.progress}>
              <span>{editor.progress.name}</span>
              <ViewProgress value={Math.round(100 * editor.progress.value)} />
            </div>
          )}
          <ViewInputFile
            ref={editor.refInput}
            variant="text"
            icon={IconImport}
            multiple
            enabled={!isUploading && attachments.length < WRITTEN_MAX_ATTACHMENTS}
            waiting={isUploading}
            onLoad={editor.upload}
          >
            {tr.add}
          </ViewInputFile>
        </>
      )}
    </div>
  );
}
