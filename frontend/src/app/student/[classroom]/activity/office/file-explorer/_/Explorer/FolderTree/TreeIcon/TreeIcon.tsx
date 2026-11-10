import { Theme } from "@tolokoban/ui";

import Styles from "./TreeIcon.module.css";

const $ = Theme.classNames;

export interface TreeIconProps {
  className?: string;
  kind: "computer" | "folder";
}

export function TreeIcon({ className, kind }: TreeIconProps) {
  return (
    <svg className={$.join(className, Styles.treeIcon)} viewBox="0 0 16 16" data-kind={kind}>
      {kind === "folder" ? (
        <path d="M1 3.5h5l1.5 1.5H15v8.5H1z" />
      ) : (
        <>
          <rect x="1" y="2" width="14" height="9" rx="1" />
          <path d="M5 14h6M8 11v3" />
        </>
      )}
    </svg>
  );
}
