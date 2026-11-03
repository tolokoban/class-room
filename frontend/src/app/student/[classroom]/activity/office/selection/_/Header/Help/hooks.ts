import { isMac, macStrokeLabel } from "../../platform";
import { SHORTCUTS } from "./shortcuts";
import { useTranslation } from "./translation";

const MAC = isMac();

export function useHelp() {
  const tr = useTranslation();
  const rows = SHORTCUTS.map(({ ids, description }) => ({
    key: ids.join(","),
    labels: ids.map((id) => strokeLabel(id, tr)),
    description: tr[description],
  }));
  return { tr, rows };
}

/** Human readable name of a keystroke identifier, like "Ctrl + Maj + →" or "⇧ ⌥ →". */
function strokeLabel(id: string, tr: ReturnType<typeof useTranslation>): string {
  if (MAC) return macStrokeLabel(id);

  const names: Record<string, string> = {
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowUp: "↑",
    ArrowDown: "↓",
    Ctrl: tr.keyCtrl,
    Shift: tr.keyShift,
    Backspace: tr.keyBackspace,
    Delete: tr.keyDelete,
    Home: tr.keyHome,
    End: tr.keyEnd,
  };
  return id
    .split("+")
    .map((part) => names[part] ?? part)
    .join(" + ");
}
