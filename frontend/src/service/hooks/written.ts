import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API } from "@/service/calls";
import { ApiError } from "@/service/calls/service";
import {
  WrittenClassroom,
  WrittenClassroomItem,
  WrittenItem,
  WrittenRef,
  WrittenResults,
  WrittenState,
} from "@/service/calls/written";

import { useApiError } from "./apiError";

/** Every query about written productions starts with this key. */
const WRITTEN_KEY = "written";

export interface WrittenQueryResult<T> {
  isLoading: boolean;
  error: ApiError | null;
  data: T | undefined;
}

export interface WrittenMutationResult<Input, Output> {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: Input): Promise<Output>;
}

/**
 * The written productions of the current teacher.
 */
export function useServiceWrittenList(): WrittenQueryResult<WrittenItem[]> {
  const { data, isLoading, error } = useQuery({
    queryKey: [WRITTEN_KEY, "list"],
    queryFn: API.written.list,
  });
  return { isLoading, error: useApiError(error), data };
}

/**
 * The written productions assigned to a class room.
 * Refreshed every `refreshInterval` milliseconds (never if `false`).
 */
export function useServiceWrittenClassroom(
  classroomCode: string,
  refreshInterval: number | false = 10000,
): WrittenQueryResult<WrittenClassroom> {
  const { data, isLoading, error } = useQuery({
    queryKey: [WRITTEN_KEY, "classroom", classroomCode],
    queryFn: () => API.written.classroom({ classroomCode }),
    refetchInterval: refreshInterval,
  });
  return { isLoading, error: useApiError(error), data };
}

/**
 * Definition, timer and uploaded files of a written production in a class room.
 * Refreshed every `refreshInterval` milliseconds.
 */
export function useServiceWrittenResults(
  ref: WrittenRef,
  refreshInterval = 10000,
): WrittenQueryResult<WrittenResults> {
  const { data, isLoading, error } = useQuery({
    queryKey: [WRITTEN_KEY, "results", ref.classroomCode, ref.writtenId],
    queryFn: () => API.written.results(ref),
    refetchInterval: refreshInterval,
  });
  return { isLoading, error: useApiError(error), data };
}

/**
 * What a student needs to display a written production.
 * Refreshed every `refreshInterval` milliseconds.
 */
export function useServiceWrittenState(
  ref: WrittenRef & { computer?: string },
  refreshInterval = 5000,
): WrittenQueryResult<WrittenState> {
  const { data, isLoading, error } = useQuery({
    queryKey: [WRITTEN_KEY, "state", ref.classroomCode, ref.writtenId, ref.computer],
    queryFn: () => API.written.state(ref),
    refetchInterval: refreshInterval,
    retry: false,
  });
  return { isLoading, error: useApiError(error), data };
}

/**
 * Text content of a file uploaded by a student.
 * Nothing is loaded while `enabled` is `false`.
 */
export function useServiceWrittenUploadContent(
  uploadId: number,
  enabled = true,
): WrittenQueryResult<string> {
  const { data, isLoading, error } = useQuery({
    queryKey: [WRITTEN_KEY, "content", uploadId],
    queryFn: () => API.written.uploadContent(uploadId),
    staleTime: Infinity,
    enabled,
  });
  return { isLoading, error: useApiError(error), data };
}

/**
 * A mutation that refreshes all the queries about written productions on success.
 */
function useWrittenMutation<Input, Output>(
  mutationFn: (input: Input) => Promise<Output>,
): WrittenMutationResult<Input, Output> {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn,
    onSettled() {
      void queryClient.invalidateQueries({ queryKey: [WRITTEN_KEY] });
    },
  });
  return { isPending, error: useApiError(error), mutate: mutateAsync };
}

export const useServiceWrittenAdd = () => useWrittenMutation(API.written.add);
export const useServiceWrittenUpdate = () => useWrittenMutation(API.written.update);
export const useServiceWrittenDelete = () => useWrittenMutation(API.written.delete);
export const useServiceWrittenAssign = () => useWrittenMutation(API.written.assign);
export const useServiceWrittenUnassign = () => useWrittenMutation(API.written.unassign);
export const useServiceWrittenTimer = () => useWrittenMutation(API.written.timer);
export const useServiceWrittenFilesDelete = () => useWrittenMutation(API.written.filesDelete);
export const useServiceWrittenUpload = () => useWrittenMutation(API.written.upload);
export const useServiceWrittenUploadDelete = () => useWrittenMutation(API.written.uploadDelete);
export const useServiceWrittenAttachmentUpload = () =>
  useWrittenMutation(API.written.attachmentUpload);
export const useServiceWrittenAttachmentDelete = () =>
  useWrittenMutation(API.written.attachmentDelete);

/**
 * Change the order of the written productions of a class room.
 * The cached list is updated immediately, to avoid flickering while the server answers.
 */
export function useServiceWrittenReorder(): WrittenMutationResult<
  { classroomCode: string; writtenIds: number[] },
  void
> {
  const queryClient = useQueryClient();
  const mutation = useWrittenMutation(API.written.reorder);
  return {
    ...mutation,
    mutate(input) {
      const queryKey = [WRITTEN_KEY, "classroom", input.classroomCode];
      void queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<WrittenClassroom>(
        queryKey,
        (data) => data && { ...data, items: sortItems(data.items, input.writtenIds) },
      );
      return mutation.mutate(input);
    },
  };
}

function sortItems(items: WrittenClassroomItem[], ids: number[]): WrittenClassroomItem[] {
  const rank = (item: WrittenClassroomItem) => {
    const index = ids.indexOf(item.id);
    return index < 0 ? ids.length : index;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}
