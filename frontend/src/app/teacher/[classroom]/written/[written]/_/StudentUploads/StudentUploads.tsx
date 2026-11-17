import { IconDelete, IconExport, Theme, ViewButton } from "@tolokoban/ui";

import { useConfirm } from "@/components/Confirm";
import { HumanSize } from "@/components/HumanSize";
import { getWrittenUploadUrl, WrittenRef, WrittenTeacherUpload } from "@/service/calls/written";

import { useStudentUploads } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./StudentUploads.module.css";

const $ = Theme.classNames;

export interface StudentUploadsProps {
  className?: string;
  writtenRef: WrittenRef;
  uploads: WrittenTeacherUpload[];
}

/**
 * The students that have uploaded at least one file, with their files.
 */
export function StudentUploads({ className, writtenRef, uploads }: StudentUploadsProps) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const list = useStudentUploads(writtenRef, uploads);
  const handleDeleteAll = () =>
    void confirm({ content: tr.deleteAllConfirm, accent: true }).then(
      (ok) => ok && list.deleteAll(),
    );

  return (
    <section className={$.join(className, Styles.studentUploads)}>
      <header>
        <span>{tr.title}</span>
        <small>{list.summary}</small>
      </header>
      <div>
        {list.groups.length === 0 && <em>{tr.empty}</em>}
        {list.groups.map((group) => (
          <article key={group.key}>
            <header>
              <strong>{group.nickname}</strong> <small>{group.hash}</small>
            </header>
            <ul>
              {group.uploads.map((upload) => (
                <li key={upload.id} title={tr.original$(upload.original)}>
                  {list.hasViewer(upload) ? (
                    <a href={list.viewerUrl(upload)}>{upload.downloadName}</a>
                  ) : (
                    <a
                      href={getWrittenUploadUrl(upload.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {upload.downloadName}
                    </a>
                  )}
                  <HumanSize bytes={upload.size} />
                  <span>{list.formatTime(upload.time)}</span>
                  {upload.late && <span className={Styles.late}>{tr.late}</span>}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <footer>
        <ViewButton
          variant="text"
          color="error"
          icon={IconDelete}
          enabled={uploads.length > 0}
          waiting={list.isDeleting}
          onClick={handleDeleteAll}
        >
          {tr.deleteAll}
        </ViewButton>
        <ViewButton icon={IconExport} enabled={uploads.length > 0} onClick={list.zipUrl}>
          {tr.zip}
        </ViewButton>
      </footer>
    </section>
  );
}
