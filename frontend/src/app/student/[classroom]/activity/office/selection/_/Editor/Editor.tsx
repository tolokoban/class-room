import { Theme } from "@tolokoban/ui";

import { type EditorState, type KeyStroke } from "../keyboard";
import { RichText } from "../RichText";
import { useEditorHandlers } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./Editor.module.css";

const $ = Theme.classNames;

export interface EditorProps {
  className?: string;
  value: EditorState;
  /** When this value changes, the editor gets the focus. */
  focusKey: unknown;
  /** @returns `true` if the keystroke has been handled. */
  onKeyStroke(stroke: KeyStroke): boolean;
}

export function Editor({ className, value, focusKey, onKeyStroke }: EditorProps) {
  const tr = useTranslation();
  const { ref, handleKeyDown, handleMouseDown } = useEditorHandlers(focusKey, onKeyStroke);
  return (
    <div
      ref={ref}
      className={$.join(className, Styles.editor)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      <RichText value={value.text} cursor={value.cursor} anchor={value.anchor} />
      <div className={Styles.hint}>{tr.focus}</div>
    </div>
  );
}
