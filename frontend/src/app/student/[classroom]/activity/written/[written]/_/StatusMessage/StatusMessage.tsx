import { IconBook, IconEdit, Theme, ViewButton } from "@tolokoban/ui";

import { UploadStatus } from "../../hooks";
import { useTranslation } from "./translation";

import Styles from "./StatusMessage.module.css";

const $ = Theme.classNames;

export interface StatusMessageProps {
  className?: string;
  /** Why the student cannot upload files right now. */
  status: Exclude<UploadStatus, "open">;
  /** URL of the teacher's follow-up page. */
  resultsUrl: string;
  /** URL of the editor of this written production. */
  editUrl: string;
}

/**
 * Explains why uploads are (partially) unavailable.
 * In preview mode, the teacher also gets buttons to follow the results or edit the activity.
 */
export function StatusMessage({ className, status, resultsUrl, editUrl }: StatusMessageProps) {
  const tr = useTranslation();

  return (
    <div className={$.join(className, Styles.statusMessage, Styles[status])}>
      <div>{tr[status]}</div>
      {status === "preview" && (
        <footer>
          <span title={tr.results}>
            <ViewButton icon={IconBook} onClick={resultsUrl}>
              {tr.resultsLabel}
            </ViewButton>
          </span>
          <span title={tr.edit}>
            <ViewButton icon={IconEdit} onClick={editUrl}>
              {tr.editLabel}
            </ViewButton>
          </span>
        </footer>
      )}
    </div>
  );
}
