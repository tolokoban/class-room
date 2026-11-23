import { useRouteParamAsString } from "@/app/routes";
import { parseWrittenActivityCode } from "@/service/calls/written";
import { useServiceActivityCurrent } from "@/service/hooks/activity";

/**
 * The student displayed by this page, and the written production that is
 * the current activity of the class room (`writtenId` is `null` if there is none).
 */
export function useStudentPage() {
  const classroom = useRouteParamAsString("classroom");
  const student = decodeParam(useRouteParamAsString("student"));
  const current = useServiceActivityCurrent(classroom);

  return {
    classroom,
    student,
    isLoading: current.isLoading,
    error: current.error,
    writtenId: parseWrittenActivityCode(current.data),
    backUrl: `#/teacher/${classroom}/students`,
  };
}

/**
 * The router does not decode the params of the hash: the nickname arrives URI-encoded.
 * Caveat: a malformed encoding is returned as is.
 */
function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
