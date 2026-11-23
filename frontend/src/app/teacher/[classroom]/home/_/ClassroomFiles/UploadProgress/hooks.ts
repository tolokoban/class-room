import React from "react";

import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import { FILE_MAX_SIZE, FileUploadNew, FileUploadReplace } from "@/service/calls/file";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceFileUpload } from "@/service/hooks/file";

import { useTranslation } from "./translation";

export interface UploadProgressState {
  /** Name of the file being uploaded. */
  name: string;
  /** Between 0 and 1. */
  value: number;
}

/**
 * Upload files with `API.file.upload()`, tracking the progress of the current one.
 * A file larger than `FILE_MAX_SIZE` is refused before sending anything.
 * Errors are notified with the name of the file.
 * Uploads are not meant to run in parallel: disable the inputs while `progress` is not `null`.
 */
export function useFileUploader() {
  const tr = useTranslation();
  const formatSize = useHumanSize();
  const translateError = useApiErrorTranslator();
  const service = useServiceFileUpload();
  const [progress, setProgress] = React.useState<UploadProgressState | null>(null);

  /**
   * @param target `{ classroomCode }` to add a file, `{ fileId }` to replace one.
   * @returns `true` if the file has been uploaded (errors are already notified).
   */
  const upload = async (target: FileUploadNew | FileUploadReplace, file: File) => {
    if (file.size > FILE_MAX_SIZE) {
      Notif.error(tr.tooLarge$(file.name, formatSize(FILE_MAX_SIZE)));
      return false;
    }
    const { name } = file;
    setProgress({ name, value: 0 });
    try {
      await service.mutate({ ...target, file, onProgress: (value) => setProgress({ name, value }) });
      return true;
    } catch (error) {
      Notif.error(tr.failed$(name, translateError(error).message));
      return false;
    } finally {
      setProgress(null);
    }
  };

  return { progress, upload };
}
