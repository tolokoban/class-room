import { Theme } from "@tolokoban/ui";
import React from "react";

import { type RichText as RichTextValue } from "../rich-text";
import { computeSegments } from "./segments";

import Styles from "./RichText.module.css";

const $ = Theme.classNames;

export interface RichTextProps {
  className?: string;
  value: RichTextValue;
  /** If defined, a caret is displayed at this position. */
  cursor?: number;
  /** The selection goes from `anchor` to `cursor`. */
  anchor?: number;
}

export function RichText({ className, value, cursor, anchor }: RichTextProps) {
  const segments = React.useMemo(
    () => computeSegments(value, cursor, anchor),
    [value, cursor, anchor],
  );
  return (
    <div className={$.join(className, Styles.richText)}>
      {segments.map((segment, index) =>
        segment.caret ? (
          <span key={index} className={Styles.caret} />
        ) : (
          <span key={index} data-bold={segment.bold} data-selected={segment.selected}>
            {segment.text}
          </span>
        ),
      )}
    </div>
  );
}
