import { Teacher, isTeacher } from "@/state";

import { api, ApiError, ApiErrorTypeAssertion, throwIfError } from "./service";

export interface UserLoginInput {
  /** Field `login` of table `user`. */
  login: string;
  /** Password in plain text. */
  password: string;
}

/**
 * Open a session for the user with this `login` and `password`.
 */
export async function userLogin(input: UserLoginInput): Promise<Teacher> {
  const result = await api("user/login", input);
  throwIfError(result, {
    [ApiError.USER_LOGIN_INVALID_INPUT]: "Invalid input.",
    [ApiError.USER_LOGIN_WRONG_CREDENTIALS]: "Unknown login or wrong password.",
  });
  if (!isTeacher(result)) {
    throw new ApiErrorTypeAssertion('Invalid response for "user/login"');
  }
  return result;
}

/**
 * Close the session of the current user.
 */
export async function userLogout(): Promise<void> {
  await api("user/logout");
}
