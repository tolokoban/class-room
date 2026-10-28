import React from "react";

import { Notification } from "./types";
import { State } from "./state";
import { nextId } from "@/utils/id";
import { isReactNode } from "@/utils/types";
import { ApiError } from "@/service/calls/service";

export const Notif = {
  error(content: unknown) {
    addNotif("error", content);
  },
  info(content: unknown) {
    addNotif("info", content);
  },
  warn(content: unknown) {
    addNotif("warn", content);
  },
  close(notifId: string) {
    const notif = State.notifications.value.find((item) => item.id === notifId);
    if (!notif) return;

    removeNotif(notif);
  },
};

function addNotif(type: Notification["type"], content: unknown, duration = 7) {
  const notif: Notification = {
    id: nextId(),
    type,
    content:
      content instanceof ApiError
        ? content
        : content instanceof Error
          ? content.message
          : isReactNode(content)
            ? content
            : JSON.stringify(content),
    visible: false,
  };
  State.notifications.value = [...State.notifications.value, notif];
  globalThis.setTimeout(() => {
    updateNotif(notif, { visible: true });
  }, 100);
  globalThis.setTimeout(() => {
    removeNotif(notif);
  }, duration * 1000);
}

function updateNotif(notif: Notification, update: Partial<Notification>): Notification {
  Object.assign(notif, update);
  State.notifications.value = [...State.notifications.value];
  return notif;
}

function removeNotif(notif: Notification) {
  updateNotif(notif, { visible: false });
  globalThis.setTimeout(() => {
    State.notifications.value = State.notifications.value.filter((item) => item !== notif);
  }, 200);
}
