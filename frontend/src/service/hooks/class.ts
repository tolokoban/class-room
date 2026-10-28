import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import { ClassAddInput, ClassItem } from "@/service/calls/class";
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
