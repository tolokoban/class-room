import React from "react";

import { goto } from "@/app/routes";
import { Notif } from "@/components/Notification";
import { API } from "@/service/calls";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { State } from "@/state";

/** Channel used to ask the other tabs to logout too. */
const LOGOUT_CHANNEL = "class-room/logout";

export function useLogoutButton() {
  const translateError = useApiErrorTranslator();
  const [isPending, setPending] = React.useState(false);
  React.useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(LOGOUT_CHANNEL);
    channel.addEventListener("message", disconnect);
    return () => channel.close();
  }, []);
  const submit = async () => {
    if (isPending) return;

    setPending(true);
    try {
      await API.user.logout();
    } catch (error) {
      Notif.error(translateError(error));
    } finally {
      setPending(false);
      disconnect();
      broadcastLogout();
    }
  };

  return {
    isPending,
    submit: () => void submit(),
  };
}

function disconnect() {
  State.user.value = null;
  goto("/");
}

function broadcastLogout() {
  if (typeof BroadcastChannel === "undefined") return;

  const channel = new BroadcastChannel(LOGOUT_CHANNEL);
  channel.postMessage("logout");
  channel.close();
}
