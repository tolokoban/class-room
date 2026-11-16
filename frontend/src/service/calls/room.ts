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
 * Remember that a student has just entered a class room, and reserve a seat for them.
 * The seat is kept until the teacher frees it (see `roomKick()`).
 * A nickname can only be used by one student of a class room.
 */
export async function roomEnter(input: RoomEnterInput): Promise<void> {
  const result = await api("room/enter", input);
  throwIfError(result, {
    [ApiError.ROOM_ENTER_INVALID_INPUT]: "Invalid input.",
    [ApiError.ROOM_ENTER_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ROOM_ENTER_DATABASE_ERROR]: "Database error while entering the class room.",
    [ApiError.ROOM_ENTER_NICKNAME_TAKEN]: `Nickname "${input.nickname}" is already used in this class room.`,
    [ApiError.ROOM_ENTER_FULL]: "The class room is full.",
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

export interface RoomCheckInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** Unique identifier of the student's computer. */
  computer: string;
}

/**
 * @returns `true` if the student still has a seat in the class room.
 * `false` means that the teacher has disconnected them.
 */
export async function roomCheck(input: RoomCheckInput): Promise<boolean> {
  const result = await api("room/check", input);
  throwIfError(result, {
    [ApiError.ROOM_CHECK_INVALID_INPUT]: "Invalid input.",
    [ApiError.ROOM_CHECK_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
  });
  if (typeof result !== "boolean") {
    throw new ApiErrorTypeAssertion('Invalid response for "room/check"');
  }
  return result;
}

export interface RoomSeat {
  nickname: string;
  /** UNIX timestamp (seconds) of the last time the student has been seen. */
  time: number;
  /** Number of files uploaded in the written productions of the class room. */
  uploads: number;
}

export interface RoomSeats {
  maxStudents: number;
  /** Current UNIX timestamp of the server (seconds). */
  now: number;
  seats: RoomSeat[];
}

/**
 * @returns The seats of a class room of the current teacher.
 */
export async function roomSeats(input: RoomStudentsInput): Promise<RoomSeats> {
  const result = await api("room/seats", input);
  throwIfError(result, {
    [ApiError.ROOM_SEATS_INVALID_INPUT]: "Invalid input.",
    [ApiError.ROOM_SEATS_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ROOM_SEATS_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
  });
  if (
    !isType(result, {
      maxStudents: "number",
      now: "number",
      seats: ["array", { nickname: "string", time: "number", uploads: "number" }],
    })
  ) {
    throw new ApiErrorTypeAssertion('Invalid response for "room/seats"');
  }
  return result;
}

export interface RoomKickInput {
  /** Field `code` of table `class`. */
  classroomCode: string;
  /** If missing, all the students are disconnected. */
  nickname?: string;
}

/**
 * Free the seat of a student, or of all the students of a class room.
 * @returns The number of freed seats.
 */
export async function roomKick(input: RoomKickInput): Promise<number> {
  const result = await api("room/kick", input);
  throwIfError(result, {
    [ApiError.ROOM_KICK_INVALID_INPUT]: "Invalid input.",
    [ApiError.ROOM_KICK_CLASS_NOT_FOUND]: `Class room "${input.classroomCode}" does not exist.`,
    [ApiError.ROOM_KICK_FORBIDDEN]: `You are not the owner of class room "${input.classroomCode}".`,
    [ApiError.ROOM_KICK_DATABASE_ERROR]: "Database error while disconnecting the students.",
  });
  if (typeof result !== "number") {
    throw new ApiErrorTypeAssertion('Invalid response for "room/kick"');
  }
  return result;
}
