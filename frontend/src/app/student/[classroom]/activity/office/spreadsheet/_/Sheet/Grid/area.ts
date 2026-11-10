import type React from "react";

import { type Rect } from "../engine/address";

/**
 * Place an element over a rectangle of cells in the CSS grid of the sheet.
 * The first row and the first column of the CSS grid are the headers.
 */
export function areaStyle({ top, left, bottom, right }: Rect): React.CSSProperties {
  return {
    gridRow: `${top + 2} / ${bottom + 3}`,
    gridColumn: `${left + 2} / ${right + 3}`,
  };
}
