import { assertType, isNumber, isType, TypeDef } from "@tolokoban/type-guards";

export async function api(entrypoint: string, input: unknown = null): Promise<unknown> {
  const resp = await post(entrypoint, input);
  if (resp.ok) return await resp.json();

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
