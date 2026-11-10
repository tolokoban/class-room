import { Theme } from "@tolokoban/ui";

import { type Click } from "../explorer";
import { FILES } from "../files";
import { FileList } from "./FileList";
import { FolderTree } from "./FolderTree";
import { useExplorer } from "./hooks";

import Styles from "./Explorer.module.css";

const $ = Theme.classNames;

export interface ExplorerProps {
  className?: string;
  /** Bit mask of the selected files. */
  mask: number;
  /** File from which a `Shift`-click starts, `null` to hide it. */
  anchor: number | null;
  /** If not defined, the selection cannot be changed. */
  onClick?(click: Click): void;
}

/**
 * Fake file explorer, looking like the one of Microsoft Windows,
 * with the folder "Documents" open.
 */
export function Explorer({ className, mask, anchor, onClick }: ExplorerProps) {
  const { tr, selectedCount } = useExplorer(mask);
  return (
    <div className={$.join(className, Styles.explorer)}>
      <header>
        <span>›</span>
        <span>{tr.thisPC}</span>
        <span>›</span>
        <b>{tr.documents}</b>
      </header>
      <div>
        <FolderTree />
        <FileList mask={mask} anchor={anchor} onClick={onClick} />
      </div>
      <footer>
        <span>{tr.items$(`${FILES.length}`)}</span>
        {selectedCount > 0 && <span>{tr.selected$(`${selectedCount}`)}</span>}
      </footer>
    </div>
  );
}
