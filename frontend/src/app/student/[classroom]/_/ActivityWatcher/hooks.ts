import React from "react";

import { goto, useRouteContext } from "@/app/routes";
import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { State } from "@/state";
import { getStudentActivityPath } from "@/utils/activity";

import { useTranslation } from "./translation";

const POLLING_INTERVAL = 4000;

export function useActivityWatcher(classroom: string) {
  const tr = useTranslation();
  const user = State.user.useValue();
  const computer = State.computer.useValue();
  const isStudent = typeof user === "string";
  const context = useRouteContext();
  // The interval callback must always see the current page.
  const currentPath = React.useRef(context?.path);
  currentPath.current = context?.path;
  React.useEffect(() => {
    if (!isStudent || !classroom) return;

    const check = async () => {
      const seated = await API.room.check({ classroomCode: classroom, computer });
      if (!seated) {
        Notif.warn(tr.kicked);
        State.user.value = null;
        goto("/");
        return;
      }

      const code = await API.activity.current({ classroomCode: classroom });
      if (!code) return;

      const path = getStudentActivityPath(classroom, code);
      if (!path || currentPath.current === path) return;

      globalThis.location.hash = `#${path}`;
    };
    const id = globalThis.setInterval(() => {
      // Network errors are ignored: we will try again at the next tick.
      check().catch(() => {});
    }, POLLING_INTERVAL);
    return () => globalThis.clearInterval(id);
  }, [isStudent, classroom, computer, tr]);
}
