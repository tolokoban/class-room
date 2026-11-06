import { IconAdd, Theme, ViewInputFile, ViewSpinner } from "@tolokoban/ui";

import { FileRow } from "./FileRow";
import { useClassroomFiles } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./ClassroomFiles.module.css";

const $ = Theme.classNames;

export interface ClassroomFilesProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

/**
 * Files uploaded by the teacher in a class room.
 */
export function ClassroomFiles({ className, classroom }: ClassroomFilesProps) {
  const tr = useTranslation();
  const files = useClassroomFiles(classroom);

  return (
    <section className={$.join(className, Styles.classroomFiles)}>
      <header>{tr.title}</header>
      <div>
        {files.isLoading && <ViewSpinner />}
        {files.error && <div className={Styles.error}>{files.error.message}</div>}
        {files.data?.length === 0 && <em>{tr.empty}</em>}
        {files.data && files.data.length > 0 && (
          <table>
            <tbody>
              {files.data.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer>
        <ViewInputFile
          ref={files.refInput}
          multiple
          icon={IconAdd}
          waiting={files.isPending}
          onLoad={files.add}
        >
          {tr.add}
        </ViewInputFile>
      </footer>
    </section>
  );
}
