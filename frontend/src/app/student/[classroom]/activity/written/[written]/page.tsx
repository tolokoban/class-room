import { ViewSpinner } from "@tolokoban/ui";

import { Md } from "@/components/Md";
import { WrittenAttachments } from "@/components/WrittenAttachments";
import { WrittenTimer } from "@/components/WrittenTimer";

import { StatusMessage } from "./_/StatusMessage";
import { UploadSlot } from "./_/UploadSlot";
import { useWrittenStudentPage } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

/**
 * Generic activity "Production écrite": the student uploads the files expected by the teacher.
 */
export default function Page() {
  const tr = useTranslation();
  const page = useWrittenStudentPage();
  const { data, status } = page;

  if (!data) {
    return (
      <div className={Styles.page}>
        {page.isLoading && <ViewSpinner />}
        {page.error && <div className={Styles.error}>{page.error.message}</div>}
      </div>
    );
  }

  const ref = { classroomCode: page.classroom, writtenId: page.writtenId };
  const canUpload = status === "open" || status === "over";
  return (
    <div className={Styles.page}>
      <div className={Styles.main}>
        <section className={Styles.description}>
          <header>{data.name}</header>
          <Md value={data.description} resolveUrl={page.resolveUrl} />
        </section>
        <WrittenAttachments attachments={data.attachments} classroomCode={page.classroom} />
      </div>
      <aside>
        <WrittenTimer timer={data.timer} now={data.now} />
        {status !== "open" && (
          <StatusMessage status={status} resultsUrl={page.resultsUrl} editUrl={page.editUrl} />
        )}
        <header>{tr.files}</header>
        {data.files.map((file) => (
          <UploadSlot
            key={file.name}
            writtenRef={ref}
            computer={page.computer}
            file={file}
            upload={data.uploads.find((upload) => upload.slot === file.name)}
            enabled={canUpload}
          />
        ))}
      </aside>
    </div>
  );
}
