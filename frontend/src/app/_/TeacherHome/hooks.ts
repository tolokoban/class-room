import React from "react";

import { Notif } from "@/components/Notification";
import { useServiceClassAdd } from "@/service/hooks/class";

import { useTranslation } from "./translation";

export function useTeacherHome() {
  const tr = useTranslation();
  const service = useServiceClassAdd();
  const [name, setName] = React.useState("");
  const refName = React.useRef<HTMLInputElement>(null);
  const add = () => {
    if (service.isPending) return;

    const value = name.trim();
    if (value === "") {
      Notif.error(tr.nameEmpty);
      refName.current?.focus();
      return;
    }
    service
      // The name is also the code the students will type to join the class.
      .mutate({ code: value, name: value })
      .then(() => {
        setName("");
        Notif.info(tr.created$(value));
      })
      .catch(Notif.error);
  };

  return {
    name,
    setName,
    refName,
    isPending: service.isPending,
    add,
  };
}
