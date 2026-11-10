import { Theme } from "@tolokoban/ui";

import { type FileExtension } from "../../../../files";

import Styles from "./FileIcon.module.css";

const $ = Theme.classNames;

/** Letters of the badge of the Office documents. */
const BADGES: Partial<Record<FileExtension, string>> = {
  docx: "W",
  xlsx: "X",
  pptx: "P",
  pdf: "PDF",
};

export interface FileIconProps {
  className?: string;
  extension: FileExtension;
}

/** A sheet of paper with a symbol depending on the type of the file. */
export function FileIcon({ className, extension }: FileIconProps) {
  const badge = BADGES[extension];
  return (
    <svg className={$.join(className, Styles.fileIcon)} viewBox="0 0 20 20" data-ext={extension}>
      <path className={Styles.page} d="M4 1.5h8l4 4v13H4z M12 1.5v4h4" />
      {badge ? (
        <>
          <rect
            className={Styles.badge}
            x="1"
            y="8"
            width={badge.length > 1 ? 15 : 9}
            height="9"
            rx="1"
          />
          <text x={badge.length > 1 ? 8.5 : 5.5} y="15">
            {badge}
          </text>
        </>
      ) : (
        <path className={Styles.symbol} d={SYMBOLS[extension]} />
      )}
    </svg>
  );
}

const SYMBOLS: Partial<Record<FileExtension, string>> = {
  png: "M6 16l3-4 2 2 2-3 2 5z M8 8.5a1.2 1.2 0 1 0 0.01 0z",
  jpg: "M6 16l3-4 2 2 2-3 2 5z M8 8.5a1.2 1.2 0 1 0 0.01 0z",
  txt: "M6 8h8M6 10.5h8M6 13h8M6 15.5h5",
  zip: "M9.5 2v2h1v2h-1v2h1v2h-1v2h1M8.5 12h3v4h-3z",
  mp3: "M9 15.5a1.5 1.5 0 1 1 0-0.1V8.5l4-1v6.5a1.5 1.5 0 1 1 0-0.1",
  mp4: "M7.5 9v7l6-3.5z",
};
