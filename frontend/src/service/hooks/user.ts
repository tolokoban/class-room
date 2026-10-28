import { useMutation } from "@tanstack/react-query";

import { API } from "@/service/calls";
import { UserLoginInput } from "@/service/calls/user";
import { ApiError } from "@/service/calls/service";
import { Teacher } from "@/state";

import { useApiError } from "./apiError";

export interface UserLoginResult {
  isPending: boolean;
  error: ApiError | null;
  mutate(input: UserLoginInput): Promise<Teacher>;
}

/**
 * Open a session for a user.
 */
export function useServiceUserLogin(): UserLoginResult {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: API.user.login,
  });

  return {
    isPending,
    error: useApiError(error),
    mutate: mutateAsync,
  };
}
