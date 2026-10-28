import { isType } from "@tolokoban/type-guards";

import { api, ApiError, ApiErrorTypeAssertion, throwIfError } from "./service";

export interface ClassItem {
  id: number;
  /** The code to give the students to access the class. */
  code: string;
  name: string;
  /** Markdown description. */
  description: string;
}

/**
 * List all the class rooms of the current teacher, sorted by name.
 */
export async function classList(): Promise<ClassItem[]> {
  const result = await api("class/list");
  if (!isClassItemArray(result)) {
    throw new ApiErrorTypeAssertion('Invalid response for "class/list"');
  }
  return result;
}

export interface ClassAddInput {
  /** The code to give the students to access the class. Must be unique. */
  code: string;
  name: string;
  /** Markdown description (default to ""). */
  description?: string;
}

/**
 * Create a new class room owned by the current teacher.
 * @returns The ID of the new class room.
 */
export async function classAdd(input: ClassAddInput): Promise<number> {
  const result = await api("class/add", input);
  throwIfError(result, {
    [ApiError.CLASS_ADD_INVALID_INPUT]: "Invalid input.",
    [ApiError.CLASS_ADD_CODE_USED]: `Code "${input.code}" is already used by another class room.`,
    [ApiError.CLASS_ADD_DATABASE_ERROR]: "Database error while creating the class room.",
  });
  if (typeof result !== "number") {
    throw new ApiErrorTypeAssertion('Invalid response for "class/add"');
  }
  return result;
}

function isClassItemArray(data: unknown): data is ClassItem[] {
  return isType(data, [
    "array",
    { id: "number", code: "string", name: "string", description: "string" },
  ]);
}
