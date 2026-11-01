import { useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import { ApiError } from "@/service/calls/service";

import { useApiError } from "./apiError";

export interface RoomStudentsResult {
  isLoading: boolean;
  error: ApiError | null;
  data: string[] | undefined;
  /** Resolved once the new data is loaded. */
  refresh(): Promise<void>;
}

/**
 * Fetch the nicknames of the students currently in a class room.
 */
export function useServiceRoomStudents(classroomCode: string): RoomStudentsResult {
  const queryClient = useQueryClient();
  const queryKey = ["room/students", classroomCode];
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => API.room.students({ classroomCode }),
  });

  return {
    isLoading,
    error: useApiError(error),
    data,
    refresh() {
      return queryClient.invalidateQueries({ queryKey });
    },
  };
}
