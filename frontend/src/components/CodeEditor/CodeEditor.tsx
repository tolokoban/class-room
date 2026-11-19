import { Theme } from "@tolokoban/ui";
import type React from "react";

import { useEditorHandlers } from "./hooks";

import Styles from "./CodeEditor.module.css";

const $ = Theme.classNames;

export interface CodeEditorProps {
  className?: string;
  value: string;
  onChange(value: string): void;
  ref?: React.Ref<HTMLTextAreaElement>;
  onScroll?: React.UIEventHandler<HTMLTextAreaElement>;
}

/**
 * Text area where the `Tab` key inserts spaces instead of moving the focus.
 */
export function CodeEditor({ className, value, onChange, ref, onScroll }: CodeEditorProps) {
  const { handleChange, handleKeyDown } = useEditorHandlers(onChange);
  return (
    <textarea
      ref={ref}
      className={$.join(className, Styles.codeEditor)}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onScroll={onScroll}
      spellCheck={false}
      autoFocus
    />
  );
}
