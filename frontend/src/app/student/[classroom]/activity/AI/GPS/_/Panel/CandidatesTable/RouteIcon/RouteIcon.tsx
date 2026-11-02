import { Theme } from "@tolokoban/ui";

import Styles from "./RouteIcon.module.css";

const $ = Theme.classNames;

export type RouteKind = "best" | "closest" | "path";

export interface RouteIconProps {
  className?: string;
  kind: RouteKind;
}

/**
 * A small horizontal path, drawn like on the canvas (one cell is one unit).
 */
export function RouteIcon({ className, kind }: RouteIconProps) {
  return (
    <svg className={$.join(className, Styles.routeIcon, Styles[kind])} viewBox="0 0 3 1">
      <line x1="0.5" y1="0.5" x2="2.5" y2="0.5" strokeWidth="0.5" />
      <line x1="0.5" y1="0.5" x2="2.5" y2="0.5" strokeWidth="0.3" />
    </svg>
  );
}
