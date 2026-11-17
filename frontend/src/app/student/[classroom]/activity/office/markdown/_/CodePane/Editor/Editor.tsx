import { Theme } from "@tolokoban/ui";

import { useEditorHandlers } from "./hooks";

import Styles from "./Editor.module.css";

const $ = Theme.classNames;

export interface EditorProps {
  className?: string;
  value: string;
  onChange(value: string): void;
}

/**
 * Text area where the `Tab` key inserts spaces instead of moving the focus.
 */
export function Editor({ className, value, onChange }: EditorProps) {
  const { handleChange, handleKeyDown } = useEditorHandlers(onChange);
  return (
    <textarea
      className={$.join(className, Styles.editor)}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      autoFocus
    />
  );
}
