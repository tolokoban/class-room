import { isNumber, isType } from "@tolokoban/type-guards";
import React from "react";

import { useServiceRoomSeats } from "@/service/hooks/room";

import { makeGroups } from "./groups";

const SIZE_KEY = "teacher/students/groupSize";

/**
 * State of the groups distribution of a class room.
 * The group size (shared by all the class rooms) and the last distribution
 * (one per class room) are kept in the session storage to survive a page refresh.
 */
export function useGroupsDistribution(classroom: string) {
  const seats = useServiceRoomSeats(classroom);
  const [size, setSize] = useSessionState(SIZE_KEY, 3, isNumber);
  const [groups, setGroups] = useSessionState(
    `teacher/students/groups/${classroom}`,
    [] as string[][],
    isGroups,
  );
  const names = seats.data?.seats.map((seat) => seat.nickname) ?? [];

  return {
    size,
    setSize: (value: number) => setSize(Math.max(1, Math.round(value))),
    groups,
    hasStudents: names.length > 0,
    distribute: () => setGroups(makeGroups(names, size)),
  };
}

function isGroups(data: unknown): data is string[][] {
  return isType(data, ["array", ["array", "string"]]);
}

/**
 * Like `React.useState`, but the value is read from and written to the session storage under `key`.
 * Caveat: a stored value that does not pass `guard` is ignored, and `initialValue` is used instead.
 */
function useSessionState<T>(
  key: string,
  initialValue: T,
  guard: (data: unknown) => data is T,
): [T, (value: T) => void] {
  const fullKey = `class-room/${key}`;
  const [value, setValue] = React.useState<T>(
    () => readSessionStorage(fullKey, guard) ?? initialValue,
  );
  React.useEffect(() => {
    setValue(readSessionStorage(fullKey, guard) ?? initialValue);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- Only reload when the key changes.
  }, [fullKey]);
  const update = (newValue: T) => {
    setValue(newValue);
    try {
      window.sessionStorage.setItem(fullKey, JSON.stringify(newValue));
    } catch (ex) {
      console.error(`Unable to store "${fullKey}" in the session storage:`, ex);
    }
  };
  return [value, update];
}

/**
 * Parse the JSON stored in the session storage under `key`.
 * Returns `undefined` if there is nothing, if it cannot be parsed or if it does not pass `guard`.
 */
function readSessionStorage<T>(key: string, guard: (data: unknown) => data is T): T | undefined {
  try {
    const text = window.sessionStorage.getItem(key);
    if (!text) return undefined;

    const data: unknown = JSON.parse(text);
    return guard(data) ? data : undefined;
  } catch {
    return undefined;
  }
}
