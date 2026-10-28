import AtomicState from "@tolokoban/react-state";
import { isString, isType } from "@tolokoban/type-guards";
import { createComputerId, isComputerId } from "./computer-id";

export const State = {
  language: new AtomicState(navigator.language, {
    storage: {
      id: "language",
      guard: isString,
    },
    transform(value: string) {
      const lang = value.trim().substring(0, 2).toLocaleLowerCase();
      return ["en", "fr", "it"].includes(lang) ? lang : "en";
    },
  }),
  /** Pseudo of the student, remembered for the next connection. */
  nickname: new AtomicState("", {
    storage: { id: "nickname", guard: isString },
  }),
  classroom: new AtomicState("", {
    storage: { id: "classroom", guard: isString },
  }),
  computer: new AtomicState(createComputerId(), {
    storage: { id: "computer", guard: isComputerId },
  }),
  /** A `Teacher`, the pseudo of a student, or `null` if nobody is connected. */
  user: new AtomicState<null | string | Teacher>(null),
};

export interface Teacher {
  id: number;
  name: string;
  login: string;
  roles: string[];
}
export function isTeacher(data: unknown): data is Teacher {
  return isType(data, {
    id: "number",
    name: "string",
    login: "string",
    roles: ["array", "string"],
  });
}
