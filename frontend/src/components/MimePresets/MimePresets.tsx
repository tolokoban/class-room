import { Theme } from "@tolokoban/ui";

import { useMimeTypesLabel } from "./hooks";

import Styles from "./MimePresets.module.css";

const $ = Theme.classNames;

export interface MimePresetsProps {
  className?: string;
  /** Accepted mime types. An empty array means "any type". */
  mimeTypes: string[];
}

/**
 * Human readable description of the types of files accepted for an expected file.
 */
export function MimePresets({ className, mimeTypes }: MimePresetsProps) {
  const getLabel = useMimeTypesLabel();

  return <span className={$.join(className, Styles.mimePresets)}>{getLabel(mimeTypes)}</span>;
}
