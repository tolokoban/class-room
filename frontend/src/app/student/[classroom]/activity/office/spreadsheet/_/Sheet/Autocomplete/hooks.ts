import React from "react";

import { applyCompletion, findCompletion } from "../engine/completion";
import { type FunctionName } from "../engine/locale";
import { type SheetController } from "../hooks";

export type AutocompleteController = ReturnType<typeof useAutocomplete>;

/**
 * Suggest the functions (in the language of the user) while typing a formula.
 *
 * - `Tab` inserts the highlighted function,
 * - `Enter` does it too, but only after choosing one with the arrows
 *   (otherwise it validates the cell, as usual),
 * - `Escape` hides the suggestions.
 */
export function useAutocomplete(sheet: SheetController) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  const [caret, setCaret] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const [highlight, setHighlight] = React.useState({ index: 0, chosen: false });
  /** Text for which the user pressed `Escape`. */
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const pendingCaret = usePendingCaret(ref, setCaret);
  const text = sheet.edit?.text ?? "";
  const completion =
    focused && sheet.edit && dismissed !== text ? findCompletion(text, caret, sheet.locale) : null;
  const index = completion ? Math.min(highlight.index, completion.functions.length - 1) : 0;
  const accept = (fn: FunctionName) => {
    if (!completion) return;

    const result = applyCompletion(text, completion, fn, sheet.locale);
    pendingCaret.current = result.caret;
    setHighlight({ index: 0, chosen: false });
    sheet.setEditText(result.text);
  };
  const updateCaret = (evt: React.SyntheticEvent<HTMLInputElement>) =>
    setCaret(evt.currentTarget.selectionStart ?? 0);
  return {
    ref,
    completion,
    index,
    accept,
    handleSelect: updateCaret,
    handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
      updateCaret(evt);
      setHighlight({ index: 0, chosen: false });
      sheet.setEditText(evt.target.value);
    },
    handleFocus(evt: React.FocusEvent<HTMLInputElement>) {
      updateCaret(evt);
      setFocused(true);
    },
    handleBlur() {
      setFocused(false);
    },
    /** @returns `true` if the key has been used by the suggestions. */
    handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): boolean {
      if (!completion) return false;

      const count = completion.functions.length;
      const action = keyAction(evt.key, highlight.chosen);
      if (!action) return false;

      evt.preventDefault();
      if (action === "accept") accept(completion.functions[index]);
      else if (action === "dismiss") setDismissed(text);
      else setHighlight({ index: (index + action + count) % count, chosen: true });
      return true;
    },
  };
}

function keyAction(key: string, chosen: boolean): "accept" | "dismiss" | 1 | -1 | null {
  switch (key) {
    case "ArrowDown":
      return 1;
    case "ArrowUp":
      return -1;
    case "Tab":
      return "accept";
    case "Enter":
      return chosen ? "accept" : null;
    case "Escape":
      return "dismiss";
  }
  return null;
}

/** After inserting a function, put the caret right after the "(". */
function usePendingCaret(
  ref: React.RefObject<HTMLInputElement | null>,
  setCaret: (caret: number) => void,
) {
  const pendingCaret = React.useRef<number | null>(null);
  React.useLayoutEffect(() => {
    const caret = pendingCaret.current;
    const input = ref.current;
    if (caret === null || !input) return;

    pendingCaret.current = null;
    input.setSelectionRange(caret, caret);
    setCaret(caret);
  });
  return pendingCaret;
}
