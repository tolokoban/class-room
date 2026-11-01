import { assertType, isNumber, isType, TypeDef } from "@tolokoban/type-guards";

import { isTeacher, State } from "@/state";

/**
 * HTTP status sent by the backend when the session has no user
 * with the role required by the entrypoint.
 */
const HTTP_FORBIDDEN = 403;

export async function api(entrypoint: string, input: unknown = null): Promise<unknown> {
  const resp = await post(entrypoint, input);
  if (resp.ok) return await resp.json();

  // The teacher has been restored from the session storage,
  // but the PHP session has expired: ask for the login again.
  if (resp.status === HTTP_FORBIDDEN && isTeacher(State.user.value)) State.user.value = null;
  throw new ApiError(resp.status, await getErrorMessage(resp));
}

/**
 * If the body of the response is a JSON object of type `{ error: string }`,
 * return this `error` attribute. Otherwise, fallback to `resp.statusText`.
 */
async function getErrorMessage(resp: Response): Promise<string> {
  try {
    const data: unknown = await resp.json();
    if (isType(data, { error: "string" })) {
      return data.error;
    }
  } catch {
    // The body is not a valid JSON.
  }
  return resp.statusText;
}

async function post(entrypoint: string, input: unknown): Promise<Response> {
  return fetch(`api/${entrypoint}`, {
    method: "POST",
    // Includes session cookie
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

/**
 * Every entrypoint-specific error code is a negative number computed as
 * `-(10000 * group + 100 * action + error)`, where:
 * - `group` is the entrypoint group (1 = user, 2 = class, 3 = activity)
 * - `action` is the action within that group
 * - `error` is the specific error within that action
 *
 * See `backend/www/api/entrypoint`.
 */
export class ApiError extends Error {
  static TYPE_ASSERTION = -1;

  // user/login (01-01)
  static USER_LOGIN_INVALID_INPUT = -10101;
  static USER_LOGIN_WRONG_CREDENTIALS = -10102;

  // class/add (02-01)
  static CLASS_ADD_INVALID_INPUT = -20101;
  static CLASS_ADD_CODE_USED = -20102;
  static CLASS_ADD_DATABASE_ERROR = -20103;

  // class/delete (02-04)
  static CLASS_DELETE_INVALID_INPUT = -20401;
  static CLASS_DELETE_NOT_FOUND = -20402;
  static CLASS_DELETE_FORBIDDEN = -20403;
  static CLASS_DELETE_DATABASE_ERROR = -20404;

  // activity/result-set (03-01)
  static ACTIVITY_RESULT_SET_INVALID_INPUT = -30101;
  static ACTIVITY_RESULT_SET_CLASS_NOT_FOUND = -30102;
  static ACTIVITY_RESULT_SET_NICKNAME_TAKEN = -30103;
  static ACTIVITY_RESULT_SET_DATABASE_ERROR = -30104;

  // activity/result-all (03-02)
  static ACTIVITY_RESULT_ALL_INVALID_INPUT = -30201;
  static ACTIVITY_RESULT_ALL_CLASS_NOT_FOUND = -30202;
  static ACTIVITY_RESULT_ALL_FORBIDDEN = -30203;

  // activity/clear (03-03)
  static ACTIVITY_CLEAR_INVALID_INPUT = -30301;
  static ACTIVITY_CLEAR_CLASS_NOT_FOUND = -30302;
  static ACTIVITY_CLEAR_FORBIDDEN = -30303;
  static ACTIVITY_CLEAR_DATABASE_ERROR = -30304;

  // activity/current (03-04)
  static ACTIVITY_CURRENT_INVALID_INPUT = -30401;
  static ACTIVITY_CURRENT_CLASS_NOT_FOUND = -30402;

  // activity/current-set (03-05)
  static ACTIVITY_CURRENT_SET_INVALID_INPUT = -30501;
  static ACTIVITY_CURRENT_SET_CLASS_NOT_FOUND = -30502;
  static ACTIVITY_CURRENT_SET_FORBIDDEN = -30503;
  static ACTIVITY_CURRENT_SET_DATABASE_ERROR = -30504;

  // room/enter (04-01)
  static ROOM_ENTER_INVALID_INPUT = -40101;
  static ROOM_ENTER_CLASS_NOT_FOUND = -40102;
  static ROOM_ENTER_DATABASE_ERROR = -40103;

  // room/students (04-02)
  static ROOM_STUDENTS_INVALID_INPUT = -40201;
  static ROOM_STUDENTS_CLASS_NOT_FOUND = -40202;
  static ROOM_STUDENTS_FORBIDDEN = -40203;

  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    console.error(`ApiError (#${code}): ${message}`);
  }
}

export class ApiErrorTypeAssertion extends ApiError {
  constructor(message: string) {
    super(ApiError.TYPE_ASSERTION, message);
  }
}

export function assertApiType<T extends TypeDef>(data: unknown, type: T, message: string) {
  try {
    assertType(data, type, "response");
  } catch (error) {
    throw new ApiErrorTypeAssertion(`${message}:\n${error}`);
  }
}

/**
 * If `code` is a negative number, throw an `ApiError` with the matching message
 * from `messages` (or a generic message if the code is unknown).
 * Otherwise, do nothing.
 */
export function throwIfError(code: unknown, messages: Record<number, string>) {
  if (!isNumber(code) || code >= 0) return;

  const message = messages[code];
  if (message) throw new ApiError(code, message);
  throw new ApiError(code, `Unknown error: ${code}!`);
}
