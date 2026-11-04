import React from "react";

import { useRouteContext } from "@/app/routes";
import { isRoutePath } from "@/app/types";
import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { State } from "@/state";

import { useTranslation } from "./translation";

const POLLING_INTERVAL = 4000;

export function useActivityWatcher(classroom: string) {
  const tr = useTranslation();
  const user = State.user.useValue();
  const isStudent = typeof user === "string";
  const context = useRouteContext();
  // The interval callback must always see the current page.
  const currentRoute = React.useRef(context?.route);
  currentRoute.current = context?.route;
  React.useEffect(() => {
    if (!isStudent || !classroom) return;

    const check = async () => {
      const code = await API.activity.current({ classroomCode: classroom });
      if (!code) return;

      const route = `/student/[classroom]/activity/${code}`;
      if (!isRoutePath(route) || currentRoute.current === route) return;

      globalThis.location.hash = `#/student/${classroom}/activity/${code}`;
    };
    const id = globalThis.setInterval(() => {
      // Network errors are ignored: we will try again at the next tick.
      check().catch(() => {});
    }, POLLING_INTERVAL);
    return () => globalThis.clearInterval(id);
  }, [isStudent, classroom, tr]);
}
