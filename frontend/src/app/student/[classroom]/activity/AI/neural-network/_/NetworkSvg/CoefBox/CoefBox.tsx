import { Theme } from "@tolokoban/ui";

import { BOX_HEIGHT, BOX_WIDTH, formatCoef, type Point } from "../layout";
import { useTranslation } from "../translation";

import Styles from "./CoefBox.module.css";

const $ = Theme.classNames;

export interface CoefBoxProps {
  className?: string;
  /** Top-left corner. */
  position: Point;
  value: number;
  /** Value before the last correction, if any. */
  previous?: number;
  bias?: boolean;
}

export function CoefBox({ className, position, value, previous, bias }: CoefBoxProps) {
  const tr = useTranslation();
  return (
    <g
      className={$.join(className, Styles.coefBox, bias && Styles.bias, getChange(value, previous))}
    >
      {previous !== undefined && <title>{tr.previous$(formatCoef(previous))}</title>}
      <rect x={position.x} y={position.y} width={BOX_WIDTH} height={BOX_HEIGHT} />
      <text x={position.x + BOX_WIDTH / 2} y={position.y + BOX_HEIGHT / 2}>
        {formatCoef(value)}
      </text>
    </g>
  );
}

function getChange(value: number, previous: number | undefined): string | undefined {
  if (previous === undefined) return undefined;

  const delta = Math.round(value * 100) - Math.round(previous * 100);
  if (delta > 0) return Styles.up;
  if (delta < 0) return Styles.down;
  return undefined;
}
