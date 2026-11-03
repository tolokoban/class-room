import { type KeyStroke } from "./keyboard";

export interface KeyEventLike {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? nav.userAgent;
  return /mac|iphone|ipad/i.test(platform);
}

/**
 * Convert a keyboard event into the keystroke a Windows/Linux user would hit
 * to get the same effect. This way, the editor, the solver and the comparison
 * of the keystrokes work the same on all platforms.
 * On a Mac:
 * - ⌘ ← / ⌘ → are Home / End,
 * - ⌘ ↑ / ⌘ ↓ are Ctrl+Home / Ctrl+End,
 * - ⌥ ← / ⌥ → / ⌥ ⌫ / ⌥ ⌦ are Ctrl+← / Ctrl+→ / Ctrl+⌫ / Ctrl+⌦,
 * - ⌥ with a character just types a special character,
 * - ⌘ is Ctrl for everything else (⌘ B, ⌘ C...).
 */
export function toKeyStroke(event: KeyEventLike, mac: boolean): KeyStroke {
  const { key, ctrlKey, metaKey, shiftKey: shift, altKey } = event;
  if (!mac) return { key, ctrl: ctrlKey || metaKey, shift, alt: altKey };

  if (metaKey) {
    if (key === "ArrowLeft") return { key: "Home", ctrl: false, shift, alt: false };
    if (key === "ArrowRight") return { key: "End", ctrl: false, shift, alt: false };
    if (key === "ArrowUp") return { key: "Home", ctrl: true, shift, alt: false };
    if (key === "ArrowDown") return { key: "End", ctrl: true, shift, alt: false };
    return { key, ctrl: true, shift, alt: false };
  }
  if (altKey) {
    if (["ArrowLeft", "ArrowRight", "Backspace", "Delete"].includes(key)) {
      return { key, ctrl: true, shift, alt: false };
    }
    if (key.length === 1) return { key, ctrl: false, shift, alt: false };
  }
  return { key, ctrl: ctrlKey, shift, alt: altKey };
}

const MAC_KEYS: Record<string, string> = {
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  Backspace: "⌫",
  Delete: "⌦",
  Enter: "↩",
  PageUp: "⇞",
  PageDown: "⇟",
  Insert: "Insert",
};

/**
 * Mac name of a keystroke identifier (see `strokeId()`),
 * for instance "Ctrl+Shift+ArrowLeft" gives "⇧ ⌥ ←".
 */
export function macStrokeLabel(id: string): string {
  const parts = id.split("+");
  const key = parts.pop() ?? "";
  let ctrl = parts.includes("Ctrl");
  let alt = parts.includes("Alt");
  let cmd = false;
  let name = MAC_KEYS[key] ?? key;
  if (key === "Home" || key === "End") {
    cmd = true;
    name = ctrl ? (key === "Home" ? "↑" : "↓") : key === "Home" ? "←" : "→";
    ctrl = false;
  } else if (ctrl && ["ArrowLeft", "ArrowRight", "Backspace", "Delete"].includes(key)) {
    alt = true;
    ctrl = false;
  } else if (ctrl) {
    cmd = true;
    ctrl = false;
  }
  // Apple's order of the modifiers.
  const modifiers = [ctrl && "⌃", alt && "⌥", parts.includes("Shift") && "⇧", cmd && "⌘"];
  return [...modifiers.filter(Boolean), name].join(" ");
}
