import type React from "react";

/** What the `Tab` key inserts. */
const INDENT = "  ";

export function useEditorHandlers(onChange: (value: string) => void) {
  return {
    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      onChange(event.target.value);
    },
    handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (event.key !== "Tab" || event.ctrlKey || event.altKey || event.metaKey) return;

      event.preventDefault();
      // `execCommand` keeps the browser's undo history (Ctrl+Z).
      if (event.shiftKey || !document.execCommand("insertText", false, INDENT)) {
        insert(event.currentTarget, INDENT, onChange, event.shiftKey);
      }
    },
  };
}

/** Fallback when `execCommand` is not supported, and outdent with `Shift+Tab`. */
function insert(
  area: HTMLTextAreaElement,
  text: string,
  onChange: (value: string) => void,
  outdent: boolean,
) {
  const { value, selectionStart, selectionEnd } = area;
  if (outdent) {
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    if (!value.startsWith(text, lineStart)) return;

    onChange(value.slice(0, lineStart) + value.slice(lineStart + text.length));
    requestAnimationFrame(() => {
      const cursor = Math.max(lineStart, selectionStart - text.length);
      area.setSelectionRange(cursor, cursor);
    });
    return;
  }
  onChange(value.slice(0, selectionStart) + text + value.slice(selectionEnd));
  requestAnimationFrame(() => {
    const cursor = selectionStart + text.length;
    area.setSelectionRange(cursor, cursor);
  });
}
