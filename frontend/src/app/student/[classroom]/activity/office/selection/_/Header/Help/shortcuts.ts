import type FR from "./translation/translation.fr";

export interface Shortcut {
  /**
   * Keystroke identifiers, as Windows/Linux keystrokes (see `strokeId()`).
   * On a Mac, they are converted with `macStrokeLabel()`.
   */
  ids: string[];
  /** Translation key of the explanation. */
  description: keyof typeof FR;
}

export const SHORTCUTS: Shortcut[] = [
  { ids: ["ArrowLeft", "ArrowRight"], description: "moveChar" },
  { ids: ["ArrowUp", "ArrowDown"], description: "moveLine" },
  { ids: ["Ctrl+ArrowLeft", "Ctrl+ArrowRight"], description: "moveWord" },
  { ids: ["Home", "End"], description: "moveLineEdge" },
  { ids: ["Ctrl+Home", "Ctrl+End"], description: "moveTextEdge" },
  { ids: ["Shift+ArrowRight", "Ctrl+Shift+ArrowRight"], description: "select" },
  { ids: ["Ctrl+A"], description: "selectAll" },
  { ids: ["Ctrl+C"], description: "copy" },
  { ids: ["Ctrl+X"], description: "cut" },
  { ids: ["Ctrl+V"], description: "paste" },
  { ids: ["Ctrl+B"], description: "bold" },
  { ids: ["Backspace", "Delete"], description: "deleteChar" },
  { ids: ["Ctrl+Backspace", "Ctrl+Delete"], description: "deleteWord" },
  { ids: ["Ctrl+Z"], description: "undo" },
  { ids: ["Ctrl+Y", "Ctrl+Shift+Z"], description: "redo" },
];
