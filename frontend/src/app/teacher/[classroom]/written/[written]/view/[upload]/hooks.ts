import { useRouteParamAsInt, useRouteParamAsString } from "@/app/routes";
import { getWrittenUploadUrl } from "@/service/calls/written";
import { useServiceWrittenResults, useServiceWrittenUploadContent } from "@/service/hooks/written";
import { getWrittenViewerKind } from "@/utils/viewer";

import { useTranslation } from "./translation";

export function useUploadViewerPage() {
  const tr = useTranslation();
  const classroom = useRouteParamAsString("classroom");
  const writtenId = useRouteParamAsInt("written");
  const uploadId = useRouteParamAsInt("upload");
  const results = useServiceWrittenResults({ classroomCode: classroom, writtenId });
  const upload = results.data?.uploads.find((item) => item.id === uploadId);
  const kind = upload ? getWrittenViewerKind(upload) : null;
  const content = useServiceWrittenUploadContent(uploadId, kind !== null);
  const notFound = results.data !== undefined && upload === undefined;

  return {
    isLoading: results.isLoading || (kind !== null && content.isLoading),
    error: notFound
      ? tr.notFound
      : (results.error?.message ??
        content.error?.message ??
        (upload && !kind ? tr.noViewer : null)),
    upload,
    kind,
    content: kind ? content.data : undefined,
    backUrl: `#/teacher/${classroom}/written/${writtenId}`,
    openUrl: () => globalThis.open(getWrittenUploadUrl(uploadId), "_blank", "noopener"),
  };
}
