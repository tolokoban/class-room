import { describe, expect, it } from "vitest";

import { applyCompletion, findCompletion } from "./completion";
import { CANONICAL, type Locale } from "./locale";

const FR: Locale = {
  ...CANONICAL,
  decimal: ",",
  separator: ";",
  functions: { SUM: "SOMME", COUNT: "NB", COUNTA: "NBVAL", AVERAGE: "MOYENNE" },
};

describe("findCompletion", () => {
  it("should suggest functions starting with the typed word", () => {
    expect(findCompletion("=A1+n", 5, FR)).toEqual({
      start: 4,
      end: 5,
      functions: ["COUNT", "COUNTA"],
    });
    expect(findCompletion("=so", 3, FR)?.functions).toEqual(["SUM"]);
    expect(findCompletion("=a", 2, CANONICAL)?.functions).toEqual(["AVERAGE"]);
  });
  it("should not suggest anything when it does not apply", () => {
    expect(findCompletion("so", 2, FR)).toBeNull();
    expect(findCompletion("=A1", 3, FR)).toBeNull();
    expect(findCompletion("=$M", 3, FR)).toBeNull();
    expect(findCompletion("=SOM", 2, FR)).toBeNull();
    expect(findCompletion("=1+", 3, FR)).toBeNull();
  });
});

describe("applyCompletion", () => {
  it("should insert the name and a parenthesis", () => {
    const completion = findCompletion("=1+so", 5, FR)!;
    expect(applyCompletion("=1+so", completion, "SUM", FR)).toEqual({
      text: "=1+SOMME(",
      caret: 9,
    });
  });
  it("should not duplicate an existing parenthesis", () => {
    const completion = findCompletion("=mo(A1:A3)", 3, FR)!;
    expect(applyCompletion("=mo(A1:A3)", completion, "AVERAGE", FR)).toEqual({
      text: "=MOYENNE(A1:A3)",
      caret: 9,
    });
  });
});
