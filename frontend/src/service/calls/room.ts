import { isType } from "@tolokoban/type-guards";

import { api, ApiError, ApiErrorTypeAssertion, throwIfError } from "./service";

export interface RoomEnterInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** Unique identifier of the student's computer. */
  computer: string;
  nickname: string;
}

/**
 * Remember that a student has just entered a class room.
 * A student is only in one class room at a time.
 */
export async function roomEnter(input: RoomEnterInput): Promise<void> {
  const result = await api("room/enter", input);
  throwIfError(result, {
    [ApiError.ROOM_ENTER_INVALID_INPUT]: "Invalid input.",
    [ApiError.ROOM_ENTER_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ROOM_ENTER_DATABASE_ERROR]: "Database error while entering the class room.",
  });
}

export interface RoomStudentsInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
}

/**
 * @returns The sorted nicknames of the students currently in a class room.
 */
export async function roomStudents(input: RoomStudentsInput): Promise<string[]> {
  const result = await api("room/students", input);
  throwIfError(result, {
    [ApiError.ROOM_STUDENTS_INVALID_INPUT]: "Invalid input.",
    [ApiError.ROOM_STUDENTS_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ROOM_STUDENTS_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
  });
  if (!isType(result, ["array", "string"])) {
    throw new ApiErrorTypeAssertion('Invalid response for "room/students"');
  }
  return result;
}
