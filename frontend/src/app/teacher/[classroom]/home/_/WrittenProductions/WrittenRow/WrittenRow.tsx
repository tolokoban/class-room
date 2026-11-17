import { IconBook, IconPlay, IconStar, Theme, ViewButton } from "@tolokoban/ui";

import { HumanSize } from "@/components/HumanSize";
import { UiActionDelete } from "@/components/UiActionDelete";
import { WrittenTimer } from "@/components/WrittenTimer";
import { WrittenClassroomItem } from "@/service/calls/written";

import { useWrittenRow } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./WrittenRow.module.css";

const $ = Theme.classNames;

export interface WrittenRowProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  item: WrittenClassroomItem;
  /** UNIX timestamp (seconds) of the server when `item` has been fetched. */
  now: number;
  /** Is it the current activity of the class room? */
  active: boolean;
}

/**
 * A written production assigned to a class room.
 */
export function WrittenRow({ className, classroom, item, now, active }: WrittenRowProps) {
  const tr = useTranslation();
  const row = useWrittenRow(classroom, item);

  return (
    <li className={$.join(className, Styles.writtenRow, active && Styles.active)}>
      <a href={row.studentUrl} title={tr.preview}>
        {item.name}
      </a>
      <div>
        <WrittenTimer size="small" timer={item.timer} now={now} />
        <span>
          {tr.files$(String(item.count))} • <HumanSize bytes={item.size} />
        </span>
        <span className={Styles.actions}>
          {active ? (
            <span className={Styles.current} title={tr.active}>
              <IconStar /> {tr.activeLabel}
            </span>
          ) : (
            <span title={tr.activate}>
              <ViewButton icon={IconPlay} waiting={row.isActivating} onClick={row.activate}>
                {tr.activateLabel}
              </ViewButton>
            </span>
          )}
          <span title={tr.results}>
            <ViewButton icon={IconBook} onClick={row.resultsUrl}>
              {tr.resultsLabel}
            </ViewButton>
          </span>
          <UiActionDelete
            label={tr.unassignLabel}
            confirm={tr.unassignConfirm$(item.name)}
            waiting={row.isUnassigning}
            onDelete={row.unassign}
          />
        </span>
      </div>
    </li>
  );
}
