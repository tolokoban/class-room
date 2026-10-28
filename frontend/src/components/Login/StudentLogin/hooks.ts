import React from "react";

import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { ApiError } from "@/service/calls/service";
import { State } from "@/state";

import { useTranslation } from "./translation";

export function useStudentLogin() {
  const tr = useTranslation();
  const [nickname, setNickname] = State.nickname.useState();
  const [classroom, setClassroom] = State.classroom.useState();
  const [isPending, setPending] = React.useState(false);
  const refNickname = React.useRef<HTMLInputElement>(null);
  const refClassroom = React.useRef<HTMLInputElement>(null);
  const submit = async () => {
    if (isPending) return;

    const name = nickname.trim();
    if (name === "") {
      Notif.error(tr.nicknameEmpty);
      refNickname.current?.focus();
      return;
    }
    const code = classroom.trim();
    if (code === "") {
      Notif.error(tr.classroomEmpty);
      refClassroom.current?.focus();
      return;
    }
    setPending(true);
    try {
      await API.activity.current({ classroomCode: code });
      setClassroom(code);
      State.user.value = name;
    } catch (error) {
      if (error instanceof ApiError && error.code === ApiError.ACTIVITY_CURRENT_CLASS_NOT_FOUND) {
        Notif.error(tr.classroomNotFound);
        refClassroom.current?.focus();
      } else Notif.error(error);
    } finally {
      setPending(false);
    }
  };

  return {
    nickname,
    setNickname,
    classroom,
    setClassroom,
    isPending,
    refNickname,
    refClassroom,
    submit: () => void submit(),
  };
}
