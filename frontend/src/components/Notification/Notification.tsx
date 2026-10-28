import React from "react";
import { IconClose, Theme } from "@tolokoban/ui";

import { State } from "./state";
import { Notification } from "./types";

import { Notif } from "./manager";
import { Md } from "../Md";
import { useTranslation } from "@/service/hooks/translation";

import Styles from "./Notification.module.css";
import { ApiError } from "@/service/calls/service";

const $ = Theme.classNames;

export function NotificationProvider() {
  const notifications = State.notifications.useValue();

  return (
    <div className={Styles.notification}>
      {notifications.map((notif) => (
        <NotificationItem value={notif} key={notif.id} />
      ))}
    </div>
  );
}

function NotificationItem({ value }: { value: Notification }) {
  const tr = useTranslation();
  const { id, type, content, visible } = value;

  return (
    <div className={$.join(Styles.item, visible ? Styles.show : Styles.hide, Styles[type])}>
      {content instanceof ApiError ? (
        <main>
          <Md
            value={
              (tr as unknown as Record<string, string>)[`all${Math.abs(content.code)}`] ??
              content.message
            }
          />
        </main>
      ) : (
        <main>{typeof content === "string" ? <Md value={content} /> : content}</main>
      )}
      <IconClose
        onClick={() => {
          Notif.close(id);
        }}
      />
    </div>
  );
}
