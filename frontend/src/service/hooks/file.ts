import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import { FileAddInput, FileDeleteInput, FileItem, FileReplaceInput } from "@/service/calls/file";
import { ApiError } from "@/service/calls/service";

import { useApiError } from "./apiError";

export interface FileListResult {
  isLoading: boolean;
  error: ApiError | null;
  data: FileItem[] | undefined;
}

export interface FileMutationResult<Input, Output> {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: Input): Promise<Output>;
}

const FILE_LIST_KEY = "file/list";

/**
 * Fetch the files of a class room of the current teacher.
 */
export function useServiceFileList(classroomCode: string): FileListResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [FILE_LIST_KEY, classroomCode],
    queryFn: () => API.file.list({ classroomCode }),
  });

  return {
    isLoading,
    error: useApiError(error),
    data,
  };
}

/**
 * Upload a new file in a class room.
 * The matching `useServiceFileList()` is refreshed on success.
 */
export function useServiceFileAdd(): FileMutationResult<FileAddInput, number> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.file.add,
    onSuccess(_, { classroomCode }) {
      void queryClient.invalidateQueries({ queryKey: [FILE_LIST_KEY, classroomCode] });
    },
  });

  return { isPending, error: useApiError(error), mutate: mutateAsync };
}

/**
 * Replace an existing file.
 * Every `useServiceFileList()` is refreshed on success.
 */
export function useServiceFileReplace(): FileMutationResult<FileReplaceInput, number> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.file.replace,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: [FILE_LIST_KEY] });
    },
  });

  return { isPending, error: useApiError(error), mutate: mutateAsync };
}

/**
 * Permanently delete a file.
 * Every `useServiceFileList()` is refreshed on success.
 */
export function useServiceFileDelete(): FileMutationResult<FileDeleteInput, void> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.file.delete,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: [FILE_LIST_KEY] });
    },
  });

  return { isPending, error: useApiError(error), mutate: mutateAsync };
}
