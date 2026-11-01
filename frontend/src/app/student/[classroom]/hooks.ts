import React from "react";

import { API } from "@/service/calls";
import { State } from "@/state";

/**
 * Tell the server that the current student has entered `classroom`,
 * so that the teacher can see them in the list of the students.
 */
export function useRoomEnter(classroom: string) {
  const user = State.user.useValue();
  const computer = State.computer.useValue();
  const nickname = typeof user === "string" ? user : "";
  React.useEffect(() => {
    if (!classroom || !nickname) return;

    API.room
      .enter({ classroomCode: classroom, computer, nickname })
      .catch((error: unknown) => console.error("Unable to enter the class room:", error));
  }, [classroom, computer, nickname]);
}
