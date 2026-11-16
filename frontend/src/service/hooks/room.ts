import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import { RoomKickInput, RoomSeats } from "@/service/calls/room";
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

export interface RoomSeatsResult {
  isLoading: boolean;
  error: ApiError | null;
  data: RoomSeats | undefined;
}

const ROOM_SEATS_KEY = "room/seats";

/**
 * Fetch the seats of a class room, every 10 seconds.
 */
export function useServiceRoomSeats(classroomCode: string): RoomSeatsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [ROOM_SEATS_KEY, classroomCode],
    queryFn: () => API.room.seats({ classroomCode }),
    refetchInterval: 10000,
  });

  return { isLoading, error: useApiError(error), data };
}

export interface RoomKickResult {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: RoomKickInput): Promise<number>;
}

/**
 * Free the seat of one student, or of all the students of a class room.
 * The matching `useServiceRoomSeats()` is refreshed on success.
 */
export function useServiceRoomKick(): RoomKickResult {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.room.kick,
    onSettled(_, __, { classroomCode }) {
      void queryClient.invalidateQueries({ queryKey: [ROOM_SEATS_KEY, classroomCode] });
    },
  });

  return { isPending, error: useApiError(error), mutate: mutateAsync };
}
