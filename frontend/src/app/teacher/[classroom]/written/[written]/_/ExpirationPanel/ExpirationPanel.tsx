import { IconAdd, Theme, ViewButton, ViewInputNumber } from "@tolokoban/ui";

import { WrittenRef, WrittenTimer } from "@/service/calls/written";

import { useExpirationPanel } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./ExpirationPanel.module.css";

const $ = Theme.classNames;

export interface ExpirationPanelProps {
  className?: string;
  writtenRef: WrittenRef;
  timer: WrittenTimer;
  /** Hours between the end of the exercise and the deletion of the files. */
  expiration: number;
  /** UNIX timestamp (seconds) of the server when `timer` has been fetched. */
  now: number;
}

/**
 * When the uploaded files will be deleted, with a button to keep them longer.
 */
export function ExpirationPanel({
  className,
  writtenRef,
  timer,
  expiration,
  now,
}: ExpirationPanelProps) {
  const tr = useTranslation();
  const panel = useExpirationPanel(writtenRef, timer, expiration, now);

  return (
    <div className={$.join(className, Styles.expirationPanel)}>
      <span>{panel.message}</span>
      {panel.canExtend && (
        <div>
          <ViewInputNumber
            label={tr.hours}
            min={1}
            max={8760}
            value={panel.hours}
            onChange={panel.setHours}
          />
          <ViewButton icon={IconAdd} waiting={panel.isPending} onClick={panel.extend}>
            {tr.extend}
          </ViewButton>
        </div>
      )}
    </div>
  );
}
