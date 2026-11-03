import { type KeyStroke } from "./keyboard";

export function stroke(key: string, modifiers: Partial<KeyStroke> = {}): KeyStroke {
  return { key, ctrl: false, shift: false, alt: false, ...modifiers };
}

/**
 * Identifier of a keystroke, used to compare the student's keystrokes
 * with the solution. Typed characters are identified by the character
 * only, because Shift (uppercase) or AltGr are just ways to produce it.
 */
export function strokeId({ key, ctrl, shift, alt }: KeyStroke): string {
  const typed = key.length === 1 && (!ctrl || alt);
  if (typed) return key;

  const name = key.length === 1 ? key.toUpperCase() : key;
  return [ctrl && "Ctrl", alt && "Alt", shift && "Shift", name].filter(Boolean).join("+");
}

export interface StrokeStat {
  id: string;
  /** Number of times the student has hit this keystroke. */
  student: number;
  /** Number of times this keystroke is used in the best solution. */
  solution: number;
}

/**
 * Compare the keystrokes of the student with the solution.
 * The rows are in the order of first use by the student,
 * followed by the keystrokes the student did not use.
 */
export function compareStrokes(student: KeyStroke[], solution: KeyStroke[]): StrokeStat[] {
  const stats = new Map<string, StrokeStat>();
  const get = (id: string) => {
    const stat = stats.get(id) ?? { id, student: 0, solution: 0 };
    stats.set(id, stat);
    return stat;
  };
  for (const item of student) get(strokeId(item)).student++;
  for (const item of solution) get(strokeId(item)).solution++;
  return [...stats.values()];
}

/** Percentage of efficiency: 100 means the student found an optimal solution. */
export function computeScore(studentCount: number, solutionCount: number): number {
  if (studentCount <= 0) return 100;
  return Math.min(100, Math.round((100 * solutionCount) / studentCount));
}
