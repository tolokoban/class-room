import { isString } from "@tolokoban/type-guards";

import { api, ApiError, ApiErrorTypeAssertion, throwIfError } from "./service";

export interface ActivityResultSetInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  activityCode: string;
  /** Unique identifier of the student's computer. */
  computer: string;
  nickname: string;
  result: string;
}

/**
 * Store the result of a student for an activity.
 * A nickname already used on another computer is rejected.
 */
export async function activityResultSet(input: ActivityResultSetInput): Promise<void> {
  const result = await api("activity/result-set", input);
  throwIfError(result, {
    [ApiError.ACTIVITY_RESULT_SET_INVALID_INPUT]: "Invalid input.",
    [ApiError.ACTIVITY_RESULT_SET_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ACTIVITY_RESULT_SET_NICKNAME_TAKEN]: `Nickname "${input.nickname}" is already used on another computer.`,
    [ApiError.ACTIVITY_RESULT_SET_DATABASE_ERROR]: "Database error while storing the result.",
  });
}

export interface ActivityResultAllInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  activityCode: string;
}

/** The results per student's nickname. */
export type ActivityResultAllOutput = Record<string, string>;

export async function activityResultAll(input: ActivityResultAllInput): Promise<ActivityResultAllOutput> {
  const result = await api("activity/result-all", input);
  throwIfError(result, {
    [ApiError.ACTIVITY_RESULT_ALL_INVALID_INPUT]: "Invalid input.",
    [ApiError.ACTIVITY_RESULT_ALL_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ACTIVITY_RESULT_ALL_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
  });
  if (!isStringRecord(result)) {
    throw new ApiErrorTypeAssertion('Invalid response for "activity/result-all"');
  }
  return result;
}

export interface ActivityClearInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** If missing, the results of ALL the activities of the class room are deleted. */
  activityCode?: string;
}

export async function activityClear(input: ActivityClearInput): Promise<void> {
  const result = await api("activity/clear", input);
  throwIfError(result, {
    [ApiError.ACTIVITY_CLEAR_INVALID_INPUT]: "Invalid input.",
    [ApiError.ACTIVITY_CLEAR_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ACTIVITY_CLEAR_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
    [ApiError.ACTIVITY_CLEAR_DATABASE_ERROR]: "Database error while deleting the results.",
  });
}

export interface ActivityCurrentInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
}

/**
 * @returns The code of the activity the students must display,
 * or `null` if there is none.
 */
export async function activityCurrent(input: ActivityCurrentInput): Promise<string | null> {
  const result = await api("activity/current", input);
  throwIfError(result, {
    [ApiError.ACTIVITY_CURRENT_INVALID_INPUT]: "Invalid input.",
    [ApiError.ACTIVITY_CURRENT_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
  });
  if (result !== null && !isString(result)) {
    throw new ApiErrorTypeAssertion('Invalid response for "activity/current"');
  }
  return result;
}

export interface ActivityCurrentSetInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** `null` means that there is no current activity. */
  activityCode: string | null;
}

/**
 * Set the code of the activity the students must display.
 */
export async function activityCurrentSet(input: ActivityCurrentSetInput): Promise<void> {
  const result = await api("activity/current-set", input);
  throwIfError(result, {
    [ApiError.ACTIVITY_CURRENT_SET_INVALID_INPUT]: "Invalid input.",
    [ApiError.ACTIVITY_CURRENT_SET_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ACTIVITY_CURRENT_SET_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
    [ApiError.ACTIVITY_CURRENT_SET_DATABASE_ERROR]: "Database error while setting the current activity.",
  });
}

function isStringRecord(data: unknown): data is Record<string, string> {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    Object.values(data).every(isString)
  );
}
