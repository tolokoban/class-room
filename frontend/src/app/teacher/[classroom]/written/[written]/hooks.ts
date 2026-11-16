import { useRouteParamAsInt, useRouteParamAsString } from "@/app/routes";
import { useServiceWrittenResults } from "@/service/hooks/written";

export function useWrittenResultsPage() {
  const classroom = useRouteParamAsString("classroom");
  const writtenId = useRouteParamAsInt("written");
  const writtenRef = { classroomCode: classroom, writtenId };
  const query = useServiceWrittenResults(writtenRef);

  return { ...query, writtenRef, backUrl: `#/teacher/${classroom}/home` };
}
