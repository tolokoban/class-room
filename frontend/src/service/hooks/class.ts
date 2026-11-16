import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import {
  ClassAddInput,
  ClassDeleteInput,
  ClassItem,
  ClassUpdateInput,
} from "@/service/calls/class";
import { ApiError } from "@/service/calls/service";

import { useApiError } from "./apiError";

export interface ClassListResult {
  isLoading: boolean;
  error: ApiError | null;
  data: ClassItem[] | undefined;
  refresh(): void;
}

export interface ClassAddResult {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: ClassAddInput): Promise<number>;
}

export interface ClassDeleteResult {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: ClassDeleteInput): Promise<void>;
}

const CLASS_LIST_KEY = ["class/list"];

/**
 * Fetch the class rooms of the current teacher.
 */
export function useServiceClassList(): ClassListResult {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: CLASS_LIST_KEY,
    queryFn: API.class.list,
  });

  return {
    isLoading,
    error: useApiError(error),
    data,
    refresh() {
      void queryClient.invalidateQueries({ queryKey: CLASS_LIST_KEY });
    },
  };
}

/**
 * Create a new class room.
 * `useServiceClassList()` is refreshed on success.
 */
export function useServiceClassAdd(): ClassAddResult {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.class.add,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: CLASS_LIST_KEY });
    },
  });

  return {
    isPending,
    error: useApiError(error),
    mutate: mutateAsync,
  };
}

/**
 * Delete a class room.
 * `useServiceClassList()` is refreshed on success.
 */
export function useServiceClassDelete(): ClassDeleteResult {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.class.delete,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: CLASS_LIST_KEY });
    },
  });

  return {
    isPending,
    error: useApiError(error),
    mutate: mutateAsync,
  };
}

export interface ClassUpdateResult {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: ClassUpdateInput): Promise<void>;
}

/**
 * Update a class room.
 * `useServiceClassList()` and the seats of the class rooms are refreshed on success.
 */
export function useServiceClassUpdate(): ClassUpdateResult {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.class.update,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: CLASS_LIST_KEY });
      void queryClient.invalidateQueries({ queryKey: ["room/seats"] });
    },
  });

  return { isPending, error: useApiError(error), mutate: mutateAsync };
}
