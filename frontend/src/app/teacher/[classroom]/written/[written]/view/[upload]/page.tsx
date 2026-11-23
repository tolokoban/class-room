import { IconArrowLeft, IconExport, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { MarkdownViewer } from "@/components/MarkdownViewer";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { useUploadViewerPage } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

/**
 * Display a text or Markdown file uploaded by a student.
 */
export default function Page() {
  const tr = useTranslation();
  const user = State.user.useValue();
  const page = useUploadViewerPage();
  const { upload, content, kind } = page;

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <nav>
        <ViewButton variant="text" icon={IconArrowLeft} onClick={page.backUrl}>
          {tr.back}
        </ViewButton>
        <ViewButton variant="text" icon={IconExport} onClick={page.openUrl}>
          {tr.download}
        </ViewButton>
      </nav>
      {page.isLoading && <ViewSpinner />}
      {page.error && <div className={Styles.error}>{page.error}</div>}
      {upload && (
        <header>
          <h1>{upload.downloadName}</h1>
          <small>{tr.original$(upload.original)}</small>
        </header>
      )}
      {content !== undefined && kind === "text" && <pre>{content}</pre>}
      {content !== undefined && kind === "markdown" && <MarkdownViewer value={content} />}
    </div>
  );
}
