import { Theme } from "@tolokoban/ui";

import Styles from "./FileExtension.module.css";

const $ = Theme.classNames;

export interface FileExtensionProps {
  className?: string;
  /** Name of the file. */
  name: string;
}

/**
 * Small badge with the extension of a file ("PDF", "DOCX"...), to show its type at a glance.
 */
export function FileExtension({ className, name }: FileExtensionProps) {
  const dot = name.lastIndexOf(".");
  const extension = dot > 0 ? name.slice(dot + 1, dot + 6) : "";

  return <span className={$.join(className, Styles.fileExtension)}>{extension || "?"}</span>;
}
