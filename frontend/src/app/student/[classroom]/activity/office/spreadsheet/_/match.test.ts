import { describe, expect, it } from "vitest";

import { EXERCISES } from "../exercises";
import { findLongFormulas, findWrongFormulas, sheetMatches } from "./match";

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
  it("should refuse a formula that gives the right value by chance", () => {
    expect(sheetMatches({ A1: "2", A2: "=A1+2" }, { A1: "2", A2: "=A1*2" })).toBe(false);
  });
  it("should refuse a formula with a hardcoded number", () => {
    expect(sheetMatches({ A1: "7", A2: "=7*2" }, EXPECTED)).toBe(false);
  });
  it("should accept a different but equivalent formula on ranges", () => {
    const expected = { A1: "1", A2: "2", A3: "3", B1: "=SUM(A1:A3)" };
    expect(sheetMatches({ ...expected, B1: "=A1+A2+A3" }, expected)).toBe(true);
  });
  it("should refuse an empty sheet", () => {
    expect(sheetMatches({}, EXPECTED)).toBe(false);
  });
});

describe("findWrongFormulas", () => {
  it("should list the wrong formulas only", () => {
    const expected = { A1: "3", B1: "=A1*2", C1: "=A1+1", D1: "=A1-1" };
    const cells = { A1: "3", B1: "=A1+3", C1: "=1+A1", D1: "2" };
    expect(findWrongFormulas(cells, expected)).toEqual(["B1", "D1"]);
  });
});

describe("exercises", () => {
  for (const [id, exercise] of Object.entries(EXERCISES)) {
    it(`"${id}" should not be solved from the start`, () => {
      expect(sheetMatches(exercise.initial ?? {}, exercise.expected)).toBe(false);
    });
  }
});

describe("findLongFormulas", () => {
  const expected = { A1: "1", A2: "2", A3: "3", B1: "=SUM(A1:A3)", B2: "=A1*2" };
  it("should accept formulas of the same length or shorter", () => {
    expect(findLongFormulas({ ...expected, B2: "=2*A1" }, expected)).toEqual([]);
  });
  it("should ignore spaces", () => {
    expect(findLongFormulas({ ...expected, B2: "= A1 * 2" }, expected)).toEqual([]);
  });
  it("should list the formulas that are longer", () => {
    const cells = { ...expected, B1: "=SUM(A1, A2, A3)", B2: "=A1+A1" };
    expect(findLongFormulas(cells, expected)).toEqual(["B1", "B2"]);
  });
});
