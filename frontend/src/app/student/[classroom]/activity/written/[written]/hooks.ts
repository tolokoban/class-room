import React from "react";

import { useRouteParamAsInt, useRouteParamAsString } from "@/app/routes";
import { makeWrittenAttachmentResolver, WrittenState } from "@/service/calls/written";
import { useServiceWrittenState } from "@/service/hooks/written";
import { isTeacher, State } from "@/state";

/**
 * Why the student can (or cannot) upload files:
 * * "open": uploads are possible.
 * * "over": uploads are possible, but the timer is over.
 * * "preview": the teacher is looking at the page.
 * * "notSeated": the teacher has disconnected the student.
 * * "notStarted": the timer has not been started yet.
 * * "expired": the files have been deleted.
 */
export type UploadStatus = "open" | "over" | "preview" | "notSeated" | "notStarted" | "expired";

export function useWrittenStudentPage() {
  const classroom = useRouteParamAsString("classroom");
  const writtenId = useRouteParamAsInt("written");
  const user = State.user.useValue();
  const computer = State.computer.useValue();
  const query = useServiceWrittenState({
    classroomCode: classroom,
    writtenId,
    // The teacher has no seat in the class room.
    computer: isTeacher(user) ? undefined : computer,
  });
  const attachments = query.data?.attachments;
  /** Turns the `attachment:name` links of the description into download URLs. */
  const resolveUrl = React.useMemo(
    () => makeWrittenAttachmentResolver(attachments ?? [], classroom),
    [attachments, classroom],
  );

  return {
    ...query,
    classroom,
    writtenId,
    computer,
    resolveUrl,
    resultsUrl: `#/teacher/${classroom}/written/${writtenId}`,
    editUrl: `#/teacher/written/${writtenId}`,
    status: query.data ? getUploadStatus(query.data) : "notStarted",
  };
}

function getUploadStatus({ preview, seated, timer, now }: WrittenState): UploadStatus {
  if (preview) return "preview";
  if (!seated) return "notSeated";
  if (timer.state === "idle") return "notStarted";
  if (timer.expiresAt !== null && timer.expiresAt <= now) return "expired";
  if (timer.state === "running" && timer.endTime !== null && timer.endTime <= now) return "over";
  return "open";
}
