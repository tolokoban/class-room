import React from "react";

/** Focus the input when it appears, with the caret after the text. */
export function useCaretAtEnd(ref: React.RefObject<HTMLInputElement | null>) {
  React.useEffect(() => {
    const input = ref.current;
    if (!input) return;

    input.setSelectionRange(input.value.length, input.value.length);
    input.focus({ preventScroll: true });
  }, [ref]);
}
