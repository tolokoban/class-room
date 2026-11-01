import { Theme, ViewButton, ViewDialog } from "@tolokoban/ui";

import { useActivityMenu } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./ActivityMenu.module.css";

const $ = Theme.classNames;

export interface ActivityMenuProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Code of the activity, like `"AI/eliza"`. */
  activity: string;
  title: string;
  onClose(this: void): void;
}

export function ActivityMenu({
  className,
  classroom,
  activity,
  title,
  onClose,
}: ActivityMenuProps) {
  const tr = useTranslation();
  const menu = useActivityMenu(classroom, activity, onClose);

  return (
    <ViewDialog className={$.join(className, Styles.activityMenu)} title={title}>
      <div className={Styles.buttons}>
        <ul>
          <li>
            <ViewButton variant="text" color="secondary-5" onClick={menu.open}>
              {tr.open}
            </ViewButton>
          </li>
          <li>
            <ViewButton variant="text" color="secondary-5" onClick={menu.results}>
              {tr.results}
            </ViewButton>
          </li>
        </ul>
        <ViewButton
          color="secondary-5"
          enabled={!menu.isLoading}
          waiting={menu.isPending}
          onClick={menu.toggle}
        >
          {menu.isCurrent ? tr.unselect : tr.select}
        </ViewButton>
      </div>
    </ViewDialog>
  );
}
