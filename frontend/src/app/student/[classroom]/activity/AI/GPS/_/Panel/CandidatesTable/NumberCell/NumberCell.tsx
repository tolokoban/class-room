import { Theme } from "@tolokoban/ui";

import type { Highlight } from "../hooks";

import Styles from "./NumberCell.module.css";

const $ = Theme.classNames;

export interface NumberCellProps {
  className?: string;
  value: number;
  /** Number of decimals to display. */
  decimals?: number;
  highlight: Highlight;
}

export function NumberCell({ className, value, decimals = 0, highlight }: NumberCellProps) {
  return (
    <td className={$.join(className, Styles.numberCell)}>
      <span className={highlight && Styles[highlight]}>{value.toFixed(decimals)}</span>
    </td>
  );
}
