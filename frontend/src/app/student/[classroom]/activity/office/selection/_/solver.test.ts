import { EXERCISES } from "../exercices";
import { type KeyStroke } from "./keyboard";
import { parseRichText } from "./rich-text";
import { pickSolution, solve } from "./solver";
import { compareStrokes, strokeId } from "./strokes";

function stroke(spec: string): KeyStroke {
  const parts = spec.split("+");
  const key = parts.pop() ?? "";
  return {
    key,
    ctrl: parts.includes("Ctrl"),
    shift: parts.includes("Shift"),
    alt: parts.includes("Alt"),
  };
}

describe("office/selection/solver", () => {
  it("should find the shortest way to make a word bold", () => {
    const solutions = solve(parseRichText("ab cd ef"), parseRichText("ab {cd} ef"));
    expect(solutions?.length).toBe(3);
  });

  it("should move a word with cut and paste", () => {
    const solutions = solve(parseRichText("ab cd"), parseRichText("cd ab"));
    expect(solutions).not.toBeNull();
    expect(solutions?.length).toBeLessThanOrEqual(6);
  });

  it("should pick the solution closest to the student's keystrokes", () => {
    const solutions = solve(parseRichText("ab cd"), parseRichText("ab {cd}"));
    if (!solutions) throw new Error("No solution");
    // "Ctrl+ArrowRight, Shift+End, Ctrl+B" is also a solution.
    const student = ["Ctrl+End", "Shift+ArrowLeft", "Shift+ArrowLeft", "Ctrl+B"].map(stroke);
    const path = pickSolution(solutions, student).map(strokeId);
    expect(path).toEqual(["Ctrl+End", "Ctrl+Shift+ArrowLeft", "Ctrl+B"]);
  });

  it("should compare keystrokes", () => {
    const stats = compareStrokes(["A", "Shift+A", "ArrowRight"].map(stroke), [
      stroke("ArrowRight"),
    ]);
    expect(stats).toEqual([
      { id: "A", student: 2, solution: 0 },
      { id: "ArrowRight", student: 1, solution: 1 },
    ]);
  });

  for (const [id, exercise] of Object.entries(EXERCISES)) {
    it(`should solve exercise "${id}" quickly`, () => {
      const start = performance.now();
      const solutions = solve(parseRichText(exercise.input), parseRichText(exercise.expected));
      const time = performance.now() - start;
      console.log(`${id}: ${solutions?.length} strokes in ${time.toFixed(0)} ms`);
      expect(solutions).not.toBeNull();
      // The exercises must stay short for the students, and for the solver.
      expect(solutions?.length).toBeLessThanOrEqual(10);
      // The solver runs in a Web Worker while the student works on the exercise.
    }, 15000);
  }
});
