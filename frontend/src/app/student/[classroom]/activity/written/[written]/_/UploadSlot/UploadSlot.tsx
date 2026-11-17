import {
  IconCheck,
  IconImport,
  Theme,
  ViewButton,
  ViewInputFile,
  ViewProgress,
} from "@tolokoban/ui";

import { HumanSize } from "@/components/HumanSize";
import { getAcceptAttribute, MimePresets } from "@/components/MimePresets";
import { UiActionDelete } from "@/components/UiActionDelete";
import { WrittenExpectedFile, WrittenRef, WrittenStudentUpload } from "@/service/calls/written";

import { useUploadSlot } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./UploadSlot.module.css";

const $ = Theme.classNames;

export interface UploadSlotProps {
  className?: string;
  writtenRef: WrittenRef;
  /** Unique identifier of the student's computer. */
  computer: string;
  /** The file expected by the teacher. */
  file: WrittenExpectedFile;
  /** The file already uploaded by the student, if any. */
  upload?: WrittenStudentUpload;
  /** Can the student upload or delete files? */
  enabled: boolean;
}

/**
 * One file expected by the teacher, with the buttons to upload or delete it.
 */
export function UploadSlot({
  className,
  writtenRef,
  computer,
  file,
  upload,
  enabled,
}: UploadSlotProps) {
  const tr = useTranslation();
  const slot = useUploadSlot(writtenRef, computer, file);
  const isUploading = slot.progress !== null;

  return (
    <article className={$.join(className, Styles.uploadSlot, upload && Styles.done)}>
      <header>
        <strong>{file.name}</strong>
        <MimePresets mimeTypes={file.mimeTypes} />
        <small>{slot.maxSize}</small>
      </header>
      <div>
        {upload ? (
          <>
            <IconCheck />
            <span>{upload.original}</span>
            <HumanSize bytes={upload.size} />
            {upload.late && <span className={Styles.late}>{tr.late}</span>}
          </>
        ) : (
          <em>{tr.empty}</em>
        )}
      </div>
      {isUploading && <ViewProgress value={Math.round(100 * (slot.progress ?? 0))} />}
      <footer>
        {slot.paste && (
          <ViewButton enabled={enabled && !isUploading} onClick={slot.paste}>
            {tr.paste}
          </ViewButton>
        )}
        <div>
          {upload && enabled && !isUploading && (
            <UiActionDelete
              confirm={tr.deleteConfirm$(file.name)}
              waiting={slot.isDeleting}
              onDelete={slot.remove}
            />
          )}
          <ViewInputFile
            ref={slot.refInput}
            icon={IconImport}
            accept={getAcceptAttribute(file.mimeTypes)}
            enabled={enabled && !isUploading}
            waiting={isUploading}
            onLoad={slot.upload}
          >
            {upload ? tr.replace : tr.upload}
          </ViewInputFile>
        </div>
      </footer>
    </article>
  );
}
