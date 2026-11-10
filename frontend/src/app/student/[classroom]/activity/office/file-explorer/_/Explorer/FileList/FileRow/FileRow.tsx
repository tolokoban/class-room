import { useLangValue } from "@tolokoban/react-state";
import { Theme } from "@tolokoban/ui";

import { type FakeFile } from "../../../files";
import { FileIcon } from "./FileIcon";
import { useTranslation } from "./translation";
import { MultiLang } from "@/utils/multilang";

import Styles from "./FileRow.module.css";

const $ = Theme.classNames;

export interface FileRowProps {
  className?: string;
  file: FakeFile;
  selected: boolean;
  /** This file is the anchor of the `Shift`-clicks. */
  anchor: boolean;
  onClick(event: React.MouseEvent): void;
}

export function FileRow({ className, file, selected, anchor, onClick }: FileRowProps) {
  const tr = useTranslation();
  const lang = useLangValue();
  return (
    <div
      className={$.join(className, Styles.fileRow)}
      data-selected={selected}
      data-anchor={anchor}
      onClick={onClick}
    >
      <div>
        <FileIcon extension={file.extension} />
        <span>
          {MultiLang.get(file.name, lang)}.{file.extension}
        </span>
      </div>
      <div>{tr[file.extension]}</div>
      <div>{tr.size$(file.size.toLocaleString(lang))}</div>
    </div>
  );
}
