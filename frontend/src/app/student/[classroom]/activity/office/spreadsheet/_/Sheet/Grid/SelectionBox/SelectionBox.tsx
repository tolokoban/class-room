import { Theme } from "@tolokoban/ui";

import { type Rect } from "../../engine/address";
import { areaStyle } from "../area";

import Styles from "./SelectionBox.module.css";

const $ = Theme.classNames;

export interface SelectionBoxProps {
  className?: string;
  rect: Rect;
  /** If not defined, the fill handle is hidden. */
  onFillHandlePointerDown?(evt: React.PointerEvent): void;
}

/** Border of the selected cells, with the fill handle in its bottom right corner. */
export function SelectionBox({ className, rect, onFillHandlePointerDown }: SelectionBoxProps) {
  return (
    <div className={$.join(className, Styles.selectionBox)} style={areaStyle(rect)}>
      {onFillHandlePointerDown && <div onPointerDown={onFillHandlePointerDown} />}
    </div>
  );
}
