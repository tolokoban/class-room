import React from "react";

import { goto } from "@/app/routes";
import { isRoutePath } from "@/app/types";
import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { State } from "@/state";

import { useTranslation } from "./translation";

export function useStudentHome() {
  const tr = useTranslation();
  const classroom = State.classroom.useValue();
  const [isPending, setPending] = React.useState(false);
  const join = async () => {
    if (isPending) return;

    setPending(true);
    try {
      const activity = await API.activity.current({ classroomCode: classroom });
      if (activity === null) {
        Notif.warn(tr.noActivity);
        return;
      }
      const route = `/student/[classroom]/activity/${activity}`;
      if (isRoutePath(route)) goto(route, classroom);
      else Notif.error(tr.unknownActivity$(activity));
    } catch (error) {
      Notif.error(error);
    } finally {
      setPending(false);
    }
  };

  return {
    classroom,
    isPending,
    join: () => void join(),
    changeRoom: () => {
      State.user.value = null;
      goto("/");
    },
  };
}
