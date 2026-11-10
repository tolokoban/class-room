import { Theme } from "@tolokoban/ui";

import { TreeIcon } from "./TreeIcon";
import { useTranslation } from "./translation";

import Styles from "./FolderTree.module.css";

const $ = Theme.classNames;

type FolderKey = "thisPC" | "desktop" | "documents" | "downloads" | "pictures" | "music" | "videos";

/** Only "This PC" and "Documents" are open. */
const ITEMS: Array<{ key: FolderKey; depth: number; open?: boolean }> = [
  { key: "thisPC", depth: 0, open: true },
  { key: "desktop", depth: 1 },
  { key: "documents", depth: 1, open: true },
  { key: "downloads", depth: 1 },
  { key: "pictures", depth: 1 },
  { key: "music", depth: 1 },
  { key: "videos", depth: 1 },
];

export interface FolderTreeProps {
  className?: string;
}

/** Navigation pane of the explorer. The folders cannot be open or closed. */
export function FolderTree({ className }: FolderTreeProps) {
  const tr = useTranslation();
  return (
    <ul className={$.join(className, Styles.folderTree)}>
      {ITEMS.map(({ key, depth, open }) => (
        <li key={key} data-depth={depth} data-current={key === "documents"}>
          <span>{open ? "⌄" : "›"}</span>
          <TreeIcon kind={depth === 0 ? "computer" : "folder"} />
          <span>{tr[key]}</span>
        </li>
      ))}
    </ul>
  );
}
