import { type KeyStroke } from "../keyboard";
import { isMac, macStrokeLabel } from "../platform";
import { compareStrokes, computeScore, strokeId } from "../strokes";
import { useTranslation } from "./translation";
import { isTeacher, State } from "@/state";

const MAC = isMac();

/** Above this score, the student can go to the next exercise. */
const MIN_SCORE = 80;

const ARROWS: Record<string, string> = {
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
};

export function useResult(strokes: KeyStroke[], solution: KeyStroke[] | null) {
  const tr = useTranslation();
  const user = State.user.useValue();
  const score = solution ? computeScore(strokes.length, solution.length) : null;
  const rows = compareStrokes(strokes, solution ?? []).map((stat) => ({
    key: stat.id,
    label: strokeLabel(stat.id, tr),
    count: stat.student,
    verdict: !solution
      ? ""
      : stat.student > stat.solution
        ? tr.tooMany
        : stat.student < stat.solution
          ? tr.notEnough
          : "",
  }));
  return {
    tr,
    rows,
    score,
    canContinue: score === null || score > MIN_SCORE,
    /** The best solution is only revealed to the teachers. */
    solutionLabels:
      solution && isTeacher(user) ? solution.map((item) => strokeLabel(strokeId(item), tr)) : null,
  };
}

/** Human readable name of a keystroke identifier, like "Ctrl + Maj + →". */
function strokeLabel(id: string, tr: ReturnType<typeof useTranslation>): string {
  if (id === " ") return tr.keySpace;
  if (id.length === 1) return `« ${id} »`;
  if (MAC) return macStrokeLabel(id);

  const names: Record<string, string> = {
    ...ARROWS,
    Ctrl: tr.keyCtrl,
    Alt: tr.keyAlt,
    Shift: tr.keyShift,
    Backspace: tr.keyBackspace,
    Delete: tr.keyDelete,
    Enter: tr.keyEnter,
    Home: tr.keyHome,
    End: tr.keyEnd,
    PageUp: tr.keyPageUp,
    PageDown: tr.keyPageDown,
    Insert: tr.keyInsert,
  };
  return id
    .split("+")
    .map((part) => names[part] ?? part)
    .join(" + ");
}
