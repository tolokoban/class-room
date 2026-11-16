import React from "react";

import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { ApiError } from "@/service/calls/service";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { State } from "@/state";

/**
 * Tell the server that the current student has entered `classroom`,
 * so that the teacher can see them in the list of the students.
 * If the student cannot take a seat in the class room (nickname already used
 * by someone else, or class room full), they are disconnected.
 */
export function useRoomEnter(classroom: string) {
  const user = State.user.useValue();
  const computer = State.computer.useValue();
  const translateError = useApiErrorTranslator();
  const nickname = typeof user === "string" ? user : "";
  React.useEffect(() => {
    if (!classroom || !nickname) return;

    API.room.enter({ classroomCode: classroom, computer, nickname }).catch((error: unknown) => {
      console.error("Unable to enter the class room:", error);
      if (
        error instanceof ApiError &&
        (error.code === ApiError.ROOM_ENTER_NICKNAME_TAKEN ||
          error.code === ApiError.ROOM_ENTER_FULL)
      ) {
        Notif.error(translateError(error));
        State.user.value = null;
      }
    });
    // `translateError` changes at each render: it must not trigger the effect.
  }, [classroom, computer, nickname]);
}
