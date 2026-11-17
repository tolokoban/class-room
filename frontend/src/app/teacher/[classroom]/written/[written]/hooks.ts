import React from "react";

import { useRouteParamAsInt, useRouteParamAsString } from "@/app/routes";
import { makeWrittenAttachmentResolver } from "@/service/calls/written";
import { useServiceWrittenResults } from "@/service/hooks/written";

export function useWrittenResultsPage() {
  const classroom = useRouteParamAsString("classroom");
  const writtenId = useRouteParamAsInt("written");
  const writtenRef = { classroomCode: classroom, writtenId };
  const query = useServiceWrittenResults(writtenRef);
  const attachments = query.data?.attachments;
  /** Turns the `attachment:name` links of the description into download URLs. */
  const resolveUrl = React.useMemo(
    () => makeWrittenAttachmentResolver(attachments ?? []),
    [attachments],
  );

  return {
    ...query,
    writtenRef,
    resolveUrl,
    backUrl: `#/teacher/${classroom}/home`,
    editUrl: `#/teacher/written/${writtenId}`,
  };
}
