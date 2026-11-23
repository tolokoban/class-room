import { useLangValue } from "@tolokoban/react-state";

import { getWrittenUploadUrl, WrittenTeacherUpload } from "@/service/calls/written";
import { useServiceWrittenUploadContent } from "@/service/hooks/written";
import { getWrittenViewerKind } from "@/utils/viewer";

/**
 * An uploaded file, with its content if the application can display it.
 * The content is only fetched for the files that have a viewer.
 */
export function useStudentUpload(
  classroom: string,
  writtenId: number,
  upload: WrittenTeacherUpload,
) {
  const lang = useLangValue();
  const kind = getWrittenViewerKind(upload);
  const content = useServiceWrittenUploadContent(upload.id, kind !== null);

  return {
    kind,
    isLoading: kind !== null && content.isLoading,
    error: content.error,
    content: kind ? content.data : undefined,
    time: new Date(upload.time * 1000).toLocaleTimeString(lang, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    url: kind
      ? `#/teacher/${classroom}/written/${writtenId}/view/${upload.id}`
      : getWrittenUploadUrl(upload.id),
  };
}
