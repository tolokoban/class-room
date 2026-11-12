import { describe, expect, it } from "vitest";

import { type Exercise } from "./exercise";
import { exerciseCode } from "./exercise-code";

describe("exerciseCode", () => {
  it("should give back the cells, sorted row by row", () => {
    const code = exerciseCode({ B2: '=A2&"x"', A2: "=A1*2", A1: "7" });
    // The code is the body of an entry of `EXERCISES`.
    const exercises = new Function(`return {${code}}`)() as Record<string, Exercise>;
    // The id is random: take the only exercise, whatever its name.
    const [id, exercise] = Object.entries(exercises)[0];
    expect(id).toMatch(/^ex[0-9a-z]+$/);
    expect(Object.keys(exercise.expected)).toEqual(["A1", "A2", "B2"]);
    expect(exercise.expected).toEqual({ A1: "7", A2: "=A1*2", B2: '=A2&"x"' });
  });
});
