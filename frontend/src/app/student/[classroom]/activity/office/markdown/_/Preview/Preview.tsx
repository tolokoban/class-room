import { Theme } from "@tolokoban/ui";
import React from "react";

import { type NodePath, remarkHighlight } from "../markdown";
import { Md } from "@/components/Md";

import Styles from "./Preview.module.css";

const $ = Theme.classNames;

export interface PreviewProps {
  className?: string;
  /** Markdown code to display. */
  value: string;
  /** Path of the syntax tree node to surround, if any. */
  highlight?: NodePath;
}

/**
 * Rendering of a Markdown code, with an optional highlighted node.
 * If the node is the root, the whole preview is highlighted.
 */
export function Preview({ className, value, highlight }: PreviewProps) {
  const plugins = React.useMemo(() => [remarkHighlight(highlight, Styles.highlight)], [highlight]);
  return (
    <Md
      className={$.join(className, Styles.preview, highlight?.length === 0 && Styles.highlight)}
      value={value}
      remarkPlugins={plugins}
    />
  );
}
