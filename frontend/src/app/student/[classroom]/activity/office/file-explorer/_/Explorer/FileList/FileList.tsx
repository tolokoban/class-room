import { Theme } from "@tolokoban/ui";

import { type Click, isSelected } from "../../explorer";
import { FILES } from "../../files";
import { FileRow } from "./FileRow";
import { useFileList } from "./hooks";

import Styles from "./FileList.module.css";

const $ = Theme.classNames;

export interface FileListProps {
  className?: string;
  mask: number;
  anchor: number | null;
  /** If not defined, the selection cannot be changed. */
  onClick?(click: Click): void;
}

/** List of the files of the folder, in "details" view. */
export function FileList({ className, mask, anchor, onClick }: FileListProps) {
  const { tr, handleClick } = useFileList(onClick);
  return (
    <div
      className={$.join(className, Styles.fileList)}
      data-interactive={onClick !== undefined}
      onClick={handleClick(null)}
    >
      <header>
        <div>{tr.name}</div>
        <div>{tr.type}</div>
        <div>{tr.size}</div>
      </header>
      {FILES.map((file, index) => (
        <FileRow
          key={index}
          file={file}
          selected={isSelected(mask, index)}
          anchor={index === anchor}
          onClick={handleClick(index)}
        />
      ))}
    </div>
  );
}
