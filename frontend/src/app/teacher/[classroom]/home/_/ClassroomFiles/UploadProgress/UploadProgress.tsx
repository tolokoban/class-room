import { Theme, ViewProgress } from "@tolokoban/ui";

import { UploadProgressState } from "./hooks";

import Styles from "./UploadProgress.module.css";

const $ = Theme.classNames;

export interface UploadProgressProps {
  className?: string;
  progress: UploadProgressState;
  /** Display the name of the file being uploaded? */
  showName?: boolean;
}

/**
 * Progress bar of a file being uploaded (see `useFileUploader()`).
 */
export function UploadProgress({ className, progress, showName = false }: UploadProgressProps) {
  return (
    <div className={$.join(className, Styles.uploadProgress)}>
      {showName && <span>{progress.name}</span>}
      <ViewProgress value={Math.round(100 * progress.value)} />
    </div>
  );
}
