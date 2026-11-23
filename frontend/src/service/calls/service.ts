import { assertType, isNumber, isType, TypeDef } from "@tolokoban/type-guards";

import { isDemoMode } from "@/service/demo/user";
import { isTeacher, State } from "@/state";

/**
 * HTTP status sent by the backend when the session has no user
 * with the role required by the entrypoint.
 */
const HTTP_FORBIDDEN = 403;

export async function api(entrypoint: string, input: unknown = null): Promise<unknown> {
  // In demo mode, nothing is sent to the backend.
  if (isDemoMode()) {
    const { demoApi } = await import("@/service/demo/api");
    return demoApi(entrypoint, input);
  }

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
 * - `group` is the entrypoint group (1 = user, 2 = class, 3 = activity, 4 = room, 5 = file, 6 = written)
 * - `action` is the action within that group
 * - `error` is the specific error within that action
 *
 * See `backend/www/api/entrypoint`.
 */
export class ApiError extends Error {
  static TYPE_ASSERTION = -1;
  /** HTTP status: the request exceeds the size accepted by the server. */
  static REQUEST_TOO_LARGE = 413;

  // user/login (01-01)
  static USER_LOGIN_INVALID_INPUT = -10101;
  static USER_LOGIN_WRONG_CREDENTIALS = -10102;

  // class/add (02-01)
  static CLASS_ADD_INVALID_INPUT = -20101;
  static CLASS_ADD_CODE_USED = -20102;
  static CLASS_ADD_DATABASE_ERROR = -20103;

  // class/update (02-03)
  static CLASS_UPDATE_INVALID_INPUT = -20301;
  static CLASS_UPDATE_NOT_FOUND = -20302;
  static CLASS_UPDATE_FORBIDDEN = -20303;
  static CLASS_UPDATE_CODE_USED = -20304;
  static CLASS_UPDATE_DATABASE_ERROR = -20305;

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

  // activity/result-get (03-06)
  static ACTIVITY_RESULT_GET_INVALID_INPUT = -30601;
  static ACTIVITY_RESULT_GET_CLASS_NOT_FOUND = -30602;
  static ACTIVITY_RESULT_GET_NICKNAME_TAKEN = -30603;
  static ACTIVITY_RESULT_GET_DATABASE_ERROR = -30604;

  // room/enter (04-01)
  static ROOM_ENTER_INVALID_INPUT = -40101;
  static ROOM_ENTER_CLASS_NOT_FOUND = -40102;
  static ROOM_ENTER_DATABASE_ERROR = -40103;
  static ROOM_ENTER_NICKNAME_TAKEN = -40104;
  static ROOM_ENTER_FULL = -40105;

  // room/students (04-02)
  static ROOM_STUDENTS_INVALID_INPUT = -40201;
  static ROOM_STUDENTS_CLASS_NOT_FOUND = -40202;
  static ROOM_STUDENTS_FORBIDDEN = -40203;

  // room/check (04-03)
  static ROOM_CHECK_INVALID_INPUT = -40301;
  static ROOM_CHECK_CLASS_NOT_FOUND = -40302;

  // room/seats (04-04)
  static ROOM_SEATS_INVALID_INPUT = -40401;
  static ROOM_SEATS_CLASS_NOT_FOUND = -40402;
  static ROOM_SEATS_FORBIDDEN = -40403;

  // room/kick (04-05)
  static ROOM_KICK_INVALID_INPUT = -40501;
  static ROOM_KICK_CLASS_NOT_FOUND = -40502;
  static ROOM_KICK_FORBIDDEN = -40503;
  static ROOM_KICK_DATABASE_ERROR = -40504;

  // file/delete (05-03)
  static FILE_DELETE_INVALID_INPUT = -50301;
  static FILE_DELETE_NOT_FOUND = -50302;
  static FILE_DELETE_FORBIDDEN = -50303;
  static FILE_DELETE_DATABASE_ERROR = -50304;

  // file/list (05-04)
  static FILE_LIST_INVALID_INPUT = -50401;
  static FILE_LIST_CLASS_NOT_FOUND = -50402;
  static FILE_LIST_FORBIDDEN = -50403;

  // file/get (05-05): only used as a link, see `getFileUrl()`.

  // file/notes-get (05-06)
  static FILE_NOTES_GET_INVALID_INPUT = -50601;
  static FILE_NOTES_GET_CLASS_NOT_FOUND = -50602;
  static FILE_NOTES_GET_FORBIDDEN = -50603;
  static FILE_NOTES_GET_CONTENT_MISSING = -50604;

  // file/notes-set (05-07)
  static FILE_NOTES_SET_INVALID_INPUT = -50701;
  static FILE_NOTES_SET_CLASS_NOT_FOUND = -50702;
  static FILE_NOTES_SET_FORBIDDEN = -50703;
  static FILE_NOTES_SET_DATABASE_ERROR = -50704;
  static FILE_NOTES_SET_STORAGE_ERROR = -50705;

  // file/upload-init (05-08)
  static FILE_UPLOAD_INIT_INVALID_INPUT = -50801;
  static FILE_UPLOAD_INIT_CLASS_NOT_FOUND = -50802;
  static FILE_UPLOAD_INIT_FILE_NOT_FOUND = -50803;
  static FILE_UPLOAD_INIT_FORBIDDEN = -50804;
  static FILE_UPLOAD_INIT_NAME_USED = -50805;
  static FILE_UPLOAD_INIT_RESERVED_NAME = -50806;
  static FILE_UPLOAD_INIT_MIME_MISMATCH = -50807;
  static FILE_UPLOAD_INIT_TOO_LARGE = -50808;
  static FILE_UPLOAD_INIT_STORAGE_ERROR = -50809;
  static FILE_UPLOAD_INIT_DATABASE_ERROR = -50810;

  // file/upload-chunk (05-09)
  static FILE_UPLOAD_CHUNK_INVALID_INPUT = -50901;
  static FILE_UPLOAD_CHUNK_NOT_FOUND = -50902;
  static FILE_UPLOAD_CHUNK_BAD_CHUNK = -50903;
  static FILE_UPLOAD_CHUNK_STORAGE_ERROR = -50904;

  // file/upload-complete (05-10)
  static FILE_UPLOAD_COMPLETE_INVALID_INPUT = -51001;
  static FILE_UPLOAD_COMPLETE_NOT_FOUND = -51002;
  static FILE_UPLOAD_COMPLETE_INCOMPLETE = -51003;
  static FILE_UPLOAD_COMPLETE_NAME_USED = -51004;
  static FILE_UPLOAD_COMPLETE_STORAGE_ERROR = -51005;
  static FILE_UPLOAD_COMPLETE_DATABASE_ERROR = -51006;

  // written/add (06-02)
  static WRITTEN_ADD_INVALID_INPUT = -60201;
  static WRITTEN_ADD_NAME_USED = -60202;
  static WRITTEN_ADD_DATABASE_ERROR = -60203;

  // written/update (06-03)
  static WRITTEN_UPDATE_INVALID_INPUT = -60301;
  static WRITTEN_UPDATE_NOT_FOUND = -60302;
  static WRITTEN_UPDATE_FORBIDDEN = -60303;
  static WRITTEN_UPDATE_NAME_USED = -60304;
  static WRITTEN_UPDATE_DATABASE_ERROR = -60305;

  // written/delete (06-04)
  static WRITTEN_DELETE_INVALID_INPUT = -60401;
  static WRITTEN_DELETE_NOT_FOUND = -60402;
  static WRITTEN_DELETE_FORBIDDEN = -60403;
  static WRITTEN_DELETE_DATABASE_ERROR = -60404;

  // written/assign (06-05)
  static WRITTEN_ASSIGN_INVALID_INPUT = -60501;
  static WRITTEN_ASSIGN_CLASS_NOT_FOUND = -60502;
  static WRITTEN_ASSIGN_CLASS_FORBIDDEN = -60503;
  static WRITTEN_ASSIGN_NOT_FOUND = -60504;
  static WRITTEN_ASSIGN_FORBIDDEN = -60505;
  static WRITTEN_ASSIGN_ALREADY_ASSIGNED = -60506;
  static WRITTEN_ASSIGN_DATABASE_ERROR = -60507;

  // written/unassign (06-06)
  static WRITTEN_UNASSIGN_INVALID_INPUT = -60601;
  static WRITTEN_UNASSIGN_CLASS_NOT_FOUND = -60602;
  static WRITTEN_UNASSIGN_CLASS_FORBIDDEN = -60603;
  static WRITTEN_UNASSIGN_NOT_FOUND = -60604;
  static WRITTEN_UNASSIGN_FORBIDDEN = -60605;
  static WRITTEN_UNASSIGN_NOT_ASSIGNED = -60606;
  static WRITTEN_UNASSIGN_DATABASE_ERROR = -60607;

  // written/classroom (06-07)
  static WRITTEN_CLASSROOM_INVALID_INPUT = -60701;
  static WRITTEN_CLASSROOM_CLASS_NOT_FOUND = -60702;
  static WRITTEN_CLASSROOM_CLASS_FORBIDDEN = -60703;

  // written/timer (06-08)
  static WRITTEN_TIMER_INVALID_INPUT = -60801;
  static WRITTEN_TIMER_CLASS_NOT_FOUND = -60802;
  static WRITTEN_TIMER_CLASS_FORBIDDEN = -60803;
  static WRITTEN_TIMER_NOT_FOUND = -60804;
  static WRITTEN_TIMER_FORBIDDEN = -60805;
  static WRITTEN_TIMER_NOT_ASSIGNED = -60806;
  static WRITTEN_TIMER_WRONG_STATE = -60807;
  static WRITTEN_TIMER_DATABASE_ERROR = -60808;

  // written/results (06-09)
  static WRITTEN_RESULTS_INVALID_INPUT = -60901;
  static WRITTEN_RESULTS_CLASS_NOT_FOUND = -60902;
  static WRITTEN_RESULTS_CLASS_FORBIDDEN = -60903;
  static WRITTEN_RESULTS_NOT_FOUND = -60904;
  static WRITTEN_RESULTS_FORBIDDEN = -60905;
  static WRITTEN_RESULTS_NOT_ASSIGNED = -60906;

  // written/files-delete (06-10)
  static WRITTEN_FILES_DELETE_INVALID_INPUT = -61001;
  static WRITTEN_FILES_DELETE_CLASS_NOT_FOUND = -61002;
  static WRITTEN_FILES_DELETE_CLASS_FORBIDDEN = -61003;
  static WRITTEN_FILES_DELETE_NOT_FOUND = -61004;
  static WRITTEN_FILES_DELETE_FORBIDDEN = -61005;
  static WRITTEN_FILES_DELETE_NOT_ASSIGNED = -61006;
  static WRITTEN_FILES_DELETE_DATABASE_ERROR = -61007;

  // written/state (06-13)
  static WRITTEN_STATE_INVALID_INPUT = -61301;
  static WRITTEN_STATE_CLASS_NOT_FOUND = -61302;
  static WRITTEN_STATE_NOT_FOUND = -61303;
  static WRITTEN_STATE_NOT_ACTIVE = -61304;

  // written/upload-init (06-14)
  static WRITTEN_UPLOAD_INIT_INVALID_INPUT = -61401;
  static WRITTEN_UPLOAD_INIT_CLASS_NOT_FOUND = -61402;
  static WRITTEN_UPLOAD_INIT_NOT_FOUND = -61403;
  static WRITTEN_UPLOAD_INIT_NO_SEAT = -61404;
  static WRITTEN_UPLOAD_INIT_NOT_STARTED = -61405;
  static WRITTEN_UPLOAD_INIT_EXPIRED = -61406;
  static WRITTEN_UPLOAD_INIT_UNKNOWN_FILE = -61407;
  static WRITTEN_UPLOAD_INIT_BAD_SIZE = -61408;
  static WRITTEN_UPLOAD_INIT_BAD_TYPE = -61409;
  static WRITTEN_UPLOAD_INIT_STORAGE_ERROR = -61410;
  static WRITTEN_UPLOAD_INIT_DATABASE_ERROR = -61411;

  // written/upload-chunk (06-15)
  static WRITTEN_UPLOAD_CHUNK_INVALID_INPUT = -61501;
  static WRITTEN_UPLOAD_CHUNK_NOT_FOUND = -61502;
  static WRITTEN_UPLOAD_CHUNK_BAD_CHUNK = -61503;
  static WRITTEN_UPLOAD_CHUNK_STORAGE_ERROR = -61504;

  // written/upload-complete (06-16)
  static WRITTEN_UPLOAD_COMPLETE_INVALID_INPUT = -61601;
  static WRITTEN_UPLOAD_COMPLETE_NOT_FOUND = -61602;
  static WRITTEN_UPLOAD_COMPLETE_INCOMPLETE = -61603;
  static WRITTEN_UPLOAD_COMPLETE_BAD_TYPE = -61604;
  static WRITTEN_UPLOAD_COMPLETE_STORAGE_ERROR = -61605;
  static WRITTEN_UPLOAD_COMPLETE_DATABASE_ERROR = -61606;

  // written/upload-delete (06-17)
  static WRITTEN_UPLOAD_DELETE_INVALID_INPUT = -61701;
  static WRITTEN_UPLOAD_DELETE_CLASS_NOT_FOUND = -61702;
  static WRITTEN_UPLOAD_DELETE_NOT_FOUND = -61703;
  static WRITTEN_UPLOAD_DELETE_NO_SEAT = -61704;
  static WRITTEN_UPLOAD_DELETE_DATABASE_ERROR = -61705;

  // written/attachment-init (06-19)
  static WRITTEN_ATTACHMENT_INIT_INVALID_INPUT = -61901;
  static WRITTEN_ATTACHMENT_INIT_NOT_FOUND = -61902;
  static WRITTEN_ATTACHMENT_INIT_FORBIDDEN = -61903;
  static WRITTEN_ATTACHMENT_INIT_TOO_MANY = -61904;
  static WRITTEN_ATTACHMENT_INIT_BAD_SIZE = -61905;
  static WRITTEN_ATTACHMENT_INIT_STORAGE_ERROR = -61906;
  static WRITTEN_ATTACHMENT_INIT_DATABASE_ERROR = -61907;

  // written/attachment-chunk (06-20)
  static WRITTEN_ATTACHMENT_CHUNK_INVALID_INPUT = -62001;
  static WRITTEN_ATTACHMENT_CHUNK_NOT_FOUND = -62002;
  static WRITTEN_ATTACHMENT_CHUNK_BAD_CHUNK = -62003;
  static WRITTEN_ATTACHMENT_CHUNK_STORAGE_ERROR = -62004;

  // written/attachment-complete (06-21)
  static WRITTEN_ATTACHMENT_COMPLETE_INVALID_INPUT = -62101;
  static WRITTEN_ATTACHMENT_COMPLETE_NOT_FOUND = -62102;
  static WRITTEN_ATTACHMENT_COMPLETE_INCOMPLETE = -62103;
  static WRITTEN_ATTACHMENT_COMPLETE_STORAGE_ERROR = -62104;
  static WRITTEN_ATTACHMENT_COMPLETE_DATABASE_ERROR = -62105;

  // written/attachment-delete (06-22)
  static WRITTEN_ATTACHMENT_DELETE_INVALID_INPUT = -62201;
  static WRITTEN_ATTACHMENT_DELETE_NOT_FOUND = -62202;
  static WRITTEN_ATTACHMENT_DELETE_FORBIDDEN = -62203;
  static WRITTEN_ATTACHMENT_DELETE_DATABASE_ERROR = -62204;

  // written/list (06-01): no error code.
  // written/download (06-11), written/zip (06-12) and written/attachment-get (06-23): only used as links.

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
