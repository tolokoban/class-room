import { Theme, ViewDialog } from "@tolokoban/ui";

import { type Notion, NotionList } from "../../NotionList";
import { useTranslation } from "./translation";

import Styles from "./Help.module.css";

const $ = Theme.classNames;

export interface HelpProps {
  className?: string;
  /** Notions needed to solve the current exercise. */
  notions?: Notion[];
  onClose(): void;
}

/** Modal listing the notions needed to solve the current exercise. */
export function Help({ className, notions = [], onClose }: HelpProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.help)}
      title={tr.title}
      buttonValidate={{ children: tr.close, onClick: onClose }}
    >
      {notions.length > 0 ? <NotionList notions={notions} /> : <p>{tr.empty}</p>}
    </ViewDialog>
  );
}
