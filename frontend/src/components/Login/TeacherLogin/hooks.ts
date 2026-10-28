import React from "react";

import { Notif } from "@/components/Notification";
import { useServiceUserLogin } from "@/service/hooks/user";
import { State } from "@/state";

import { useTranslation } from "./translation";

export function useTeacherLogin() {
  const tr = useTranslation();
  const service = useServiceUserLogin();
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const canSubmit = user.trim() !== "" && password !== "" && !service.isPending;
  const submit = () => {
    if (!canSubmit) return;

    service
      .mutate({ login: user.trim(), password })
      .then((teacher) => {
        if (teacher.roles.includes("teacher")) State.user.value = teacher;
        else Notif.error(tr.notTeacher);
      })
      .catch(Notif.error);
  };

  return {
    user,
    setUser,
    password,
    setPassword,
    canSubmit,
    isPending: service.isPending,
    submit,
  };
}
