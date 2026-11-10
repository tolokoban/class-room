import { describe, expect, it } from "vitest";

import { applyClick, maskOf } from "./_/explorer";
import { FILES } from "./_/files";
import { solve } from "./_/solver";
import { EXERCISES } from "./exercises";
import { initialState } from "./_/state";

describe("file-explorer exercises", () => {
  it("should have 20 exercises", () => {
    expect(Object.keys(EXERCISES).length).toBe(20);
  });

  let previous = 0;
  for (const [id, exercise] of Object.entries(EXERCISES)) {
    it(`should have an optimal solution for "${id}"`, () => {
      const start = initialState(exercise);
      const target = maskOf(exercise.expected);
      const end = exercise.solution.reduce(applyClick, start);
      expect(end.mask).toBe(target);
      expect(solve(start, target, FILES.length, exercise.solution.length)).toBe(
        exercise.solution.length,
      );
      expect(exercise.solution.length).toBeGreaterThanOrEqual(previous);
      previous = exercise.solution.length;
    });
  }
});
