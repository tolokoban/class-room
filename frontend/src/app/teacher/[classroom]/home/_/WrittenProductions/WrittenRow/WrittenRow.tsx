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
      <div>
        {active ? (
          <span title={tr.active}>
            <IconStar />
          </span>
        ) : (
          <span title={tr.activate}>
            <ViewButton
              variant="text"
              label=""
              icon={IconPlay}
              waiting={row.isActivating}
              onClick={row.activate}
            />
          </span>
        )}
      </div>
      <a href={row.studentUrl} title={tr.preview}>
        {item.name}
      </a>
      <div>
        <WrittenTimer size="small" timer={item.timer} now={now} />
        <span>
          {tr.files$(String(item.count))} • <HumanSize bytes={item.size} />
        </span>
        <span className={Styles.actions}>
          <span title={tr.results}>
            <ViewButton variant="text" label="" icon={IconBook} onClick={row.resultsUrl} />
          </span>
          <UiActionDelete
            confirm={tr.unassignConfirm$(item.name)}
            waiting={row.isUnassigning}
            onDelete={row.unassign}
          />
        </span>
      </div>
    </li>
  );
}
