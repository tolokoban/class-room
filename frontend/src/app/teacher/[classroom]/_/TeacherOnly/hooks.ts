import React from "react";

import { goto } from "@/app/routes";
import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { State } from "@/state";

export function useTeacherOnly() {
  const [isPending, setPending] = React.useState(false);
  const backHome = async () => {
    if (isPending) return;

    setPending(true);
    try {
      await API.user.logout();
    } catch (error) {
      Notif.error(error);
    } finally {
      setPending(false);
      State.user.value = null;
      goto("/");
    }
  };

  return {
    isPending,
    backHome: () => void backHome(),
  };
}
