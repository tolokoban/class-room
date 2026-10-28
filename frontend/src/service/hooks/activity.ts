import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import {
  ActivityClearInput,
  ActivityCurrentSetInput,
  ActivityResultAllOutput,
  ActivityResultSetInput,
} from "@/service/calls/activity";
import { ApiError } from "@/service/calls/service";

import { useApiError } from "./apiError";

export interface ActivityResultAllResult {
  isLoading: boolean;
  error: ApiError | null;
  data: ActivityResultAllOutput | undefined;
  refresh(): void;
}

export interface ActivityCurrentResult {
  isLoading: boolean;
  error: ApiError | null;
  data: string | null | undefined;
  refresh(): void;
}

export interface ActivityMutationResult<Input> {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: Input): Promise<void>;
}

/**
 * Fetch the results of all the students for an activity of a class room.
 */
export function useServiceActivityResultAll(
  classroomCode: string,
  activityCode: string,
): ActivityResultAllResult {
  const queryClient = useQueryClient();
  const queryKey = ["activity/result-all", classroomCode, activityCode];
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => API.activity.resultAll({ classroomCode, activityCode }),
  });

  return {
    isLoading,
    error: useApiError(error),
    data,
    refresh() {
      void queryClient.invalidateQueries({ queryKey });
    },
  };
}

/**
 * Fetch the code of the activity the students of a class room must display.
 */
export function useServiceActivityCurrent(classroomCode: string): ActivityCurrentResult {
  const queryClient = useQueryClient();
  const queryKey = ["activity/current", classroomCode];
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => API.activity.current({ classroomCode }),
  });

  return {
    isLoading,
    error: useApiError(error),
    data,
    refresh() {
      void queryClient.invalidateQueries({ queryKey });
    },
  };
}

/**
 * Set the code of the activity the students of a class room must display.
 * The matching `useServiceActivityCurrent()` is refreshed on success.
 */
export function useServiceActivityCurrentSet(): ActivityMutationResult<ActivityCurrentSetInput> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.activity.currentSet,
    onSuccess(_, { classroomCode }) {
      void queryClient.invalidateQueries({ queryKey: ["activity/current", classroomCode] });
    },
  });

  return {
    isPending,
    error: useApiError(error),
    mutate: mutateAsync,
  };
}

/**
 * Store the result of a student for an activity.
 * The matching `useServiceActivityResultAll()` is refreshed on success.
 */
export function useServiceActivityResultSet(): ActivityMutationResult<ActivityResultSetInput> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.activity.resultSet,
    onSuccess(_, { classroomCode, activityCode }) {
      void queryClient.invalidateQueries({
        queryKey: ["activity/result-all", classroomCode, activityCode],
      });
    },
  });

  return {
    isPending,
    error: useApiError(error),
    mutate: mutateAsync,
  };
}

/**
 * Delete the results of an activity of a class room
 * (or of all its activities if `activityCode` is missing).
 * The matching `useServiceActivityResultAll()` are refreshed on success.
 */
export function useServiceActivityClear(): ActivityMutationResult<ActivityClearInput> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.activity.clear,
    onSuccess(_, { classroomCode, activityCode }) {
      const queryKey = ["activity/result-all", classroomCode];
      if (activityCode !== undefined) queryKey.push(activityCode);
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isPending,
    error: useApiError(error),
    mutate: mutateAsync,
  };
}
