import { describe, expect, it } from "vitest";

import { EXERCISES } from "../exercises";
import { sheetMatches } from "./match";

const EXPECTED = { A1: "7", A2: "=A1*2" };

describe("sheetMatches", () => {
  it("should accept the same sheet", () => {
    expect(sheetMatches({ A1: "7", A2: "=A1*2" }, EXPECTED)).toBe(true);
  });
  it("should accept an equivalent formula", () => {
    expect(sheetMatches({ A1: "7", A2: "=2*A1" }, EXPECTED)).toBe(true);
  });
  it("should refuse a value instead of a formula", () => {
    expect(sheetMatches({ A1: "7", A2: "14" }, EXPECTED)).toBe(false);
  });
  it("should refuse a different value", () => {
    expect(sheetMatches({ A1: "8", A2: "=A1*2" }, EXPECTED)).toBe(false);
  });
  it("should refuse extra cells", () => {
    expect(sheetMatches({ A1: "7", A2: "=A1*2", B1: "x" }, EXPECTED)).toBe(false);
  });
  it("should refuse an empty sheet", () => {
    expect(sheetMatches({}, EXPECTED)).toBe(false);
  });
});

describe("exercises", () => {
  for (const [id, exercise] of Object.entries(EXERCISES)) {
    it(`"${id}" should not be solved from the start`, () => {
      expect(sheetMatches(exercise.initial ?? {}, exercise.expected)).toBe(false);
    });
  }
});
