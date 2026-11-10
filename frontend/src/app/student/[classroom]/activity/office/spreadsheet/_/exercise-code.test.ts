import { describe, expect, it } from "vitest";

import { type Exercise } from "./exercise";
import { exerciseCode } from "./exercise-code";

describe("exerciseCode", () => {
  it("should give back the cells, sorted row by row", () => {
    const code = exerciseCode({ B2: '=A2&"x"', A2: "=A1*2", A1: "7" });
    // The code is the body of an entry of `EXERCISES`.
    const exercises = new Function(`return {${code}}`)() as Record<string, Exercise>;
    expect(Object.keys(exercises.newExercise.expected)).toEqual(["A1", "A2", "B2"]);
    expect(exercises.newExercise.expected).toEqual({ A1: "7", A2: "=A1*2", B2: '=A2&"x"' });
  });
});
