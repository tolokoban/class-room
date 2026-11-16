import { Theme } from "@tolokoban/ui";

import { useHumanSize } from "./hooks";

import Styles from "./HumanSize.module.css";

const $ = Theme.classNames;

export interface HumanSizeProps {
  className?: string;
  /** Size in bytes. */
  bytes: number;
}

/**
 * A size in bytes, KB, MB or GB, depending on its magnitude.
 */
export function HumanSize({ className, bytes }: HumanSizeProps) {
  const format = useHumanSize();

  return <span className={$.join(className, Styles.humanSize)}>{format(bytes)}</span>;
}
