import { Theme, ViewSpinner } from "@tolokoban/ui";

import { HumanSize } from "@/components/HumanSize";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { WrittenTeacherUpload } from "@/service/calls/written";

import { useStudentUpload } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./StudentUpload.module.css";

const $ = Theme.classNames;

export interface StudentUploadProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Id of the written production. */
  writtenId: number;
  upload: WrittenTeacherUpload;
}

/**
 * A file uploaded by a student, displayed inline when it is a text or Markdown file.
 */
export function StudentUpload({ className, classroom, writtenId, upload }: StudentUploadProps) {
  const tr = useTranslation();
  const file = useStudentUpload(classroom, writtenId, upload);

  return (
    <article className={$.join(className, Styles.studentUpload)}>
      <header title={tr.original$(upload.original)}>
        <a href={file.url} target={file.kind ? undefined : "_blank"} rel="noopener noreferrer">
          {upload.downloadName}
        </a>
        <HumanSize bytes={upload.size} />
        <span>{file.time}</span>
        {upload.late && <span className={Styles.late}>{tr.late}</span>}
      </header>
      {file.isLoading && <ViewSpinner />}
      {file.error && <div className={Styles.error}>{file.error.message}</div>}
      {!file.kind && <em>{tr.noViewer}</em>}
      {file.content !== undefined && file.kind === "text" && <pre>{file.content}</pre>}
      {file.content !== undefined && file.kind === "markdown" && (
        <MarkdownViewer value={file.content} />
      )}
    </article>
  );
}
