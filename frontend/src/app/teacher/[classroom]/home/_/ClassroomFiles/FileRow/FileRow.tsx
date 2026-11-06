import { IconImport, Theme, ViewInputFile } from "@tolokoban/ui";

import { UiActionDelete } from "@/components/UiActionDelete";
import { FileItem, getFileUrl } from "@/service/calls/file";
import { useFileRow } from "./hooks";
import { getMimeIcon } from "./mime";
import { useTranslation } from "./translation";

import Styles from "./FileRow.module.css";

const $ = Theme.classNames;

export interface FileRowProps {
  className?: string;
  file: FileItem;
}

export function FileRow({ className, file }: FileRowProps) {
  const tr = useTranslation();
  const row = useFileRow(file);
  const Icon = getMimeIcon(file.mime);

  return (
    <tr className={$.join(className, Styles.fileRow)} title={file.mime}>
      <td>
        <Icon />
      </td>
      <td>
        <a href={getFileUrl(file.id)} target="_blank" rel="noopener noreferrer">
          {file.name}
        </a>
      </td>
      <td>{row.size}</td>
      <td>
        <ViewInputFile
          ref={row.refInput}
          variant="text"
          label=""
          icon={IconImport}
          accept={row.accept}
          waiting={row.isReplacing}
          onLoad={row.replace}
        />
      </td>
      <td>
        <UiActionDelete
          confirm={tr.deleteConfirm$(file.name)}
          waiting={row.isDeleting}
          onDelete={row.remove}
        />
      </td>
    </tr>
  );
}
