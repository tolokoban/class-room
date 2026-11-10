import { describe, expect, it } from "vitest";

import { type Cells } from "./address";
import { formatValue, toCanonical, toLocal } from "./content";
import { evaluateSheet, FormulaError } from "./evaluate";
import { computeFillTarget, fill, shiftFormula } from "./fill";
import { CANONICAL, type Locale } from "./locale";

const FR: Locale = {
  decimal: ",",
  separator: ";",
  functions: { SUM: "SOMME", COUNT: "NB", COUNTA: "NBVAL", AVERAGE: "MOYENNE" },
  errors: { ...CANONICAL.errors, NAME: "#NOM?", VALUE: "#VALEUR!" },
};
const IT: Locale = {
  decimal: ",",
  separator: ";",
  functions: { SUM: "SOMMA", COUNT: "CONTA.NUMERI", COUNTA: "CONTA.VALORI", AVERAGE: "MEDIA" },
  errors: CANONICAL.errors,
};

function valueOf(cells: Cells, key: string) {
  const value = evaluateSheet(cells)[key] ?? null;
  return value instanceof FormulaError ? value.code : value;
}

describe("evaluate", () => {
  const cases: Array<[formula: string, expected: unknown]> = [
    ["=1+2*3", 7],
    ["=(1+2)*3", 9],
    ["=-A1+10", 8],
    ["=10/4", 2.5],
    ["=1/0", "DIV0"],
    ["=A1+B1", 5],
    ["=$A$1*B$1", 6],
    ["=A1+C1", "VALUE"],
    ["=A1+D1", 2],
    ["=D1", 0],
    ["=C1", "hello"],
    ["=SUM(A1:D1)", 5],
    ["=SUM(A1:D1, 10)", 15],
    ["=sum(A1;B1)", 5],
    ["=COUNT(A1:D1)", 2],
    ["=COUNTA(A1:D1)", 3],
    ["=AVERAGE(A1:D1)", 2.5],
    ["=AVERAGE(C1:D1)", "DIV0"],
    ["=FOO(A1)", "NAME"],
    ["=foo", "NAME"],
    ["=A1:B1", "VALUE"],
    ["=1+", "SYNTAX"],
    ["=SUM(A1", "SYNTAX"],
    ["=F1", "REF"],
    ["=SUM(A1:A40)", "REF"],
    ["=E1", "CIRC"],
  ];
  for (const [formula, expected] of cases) {
    it(`should evaluate ${formula}`, () => {
      const cells: Cells = { A1: "2", B1: "3", C1: "hello", E1: formula };
      expect(valueOf(cells, "E1")).toBe(expected);
    });
  }
  it("should detect indirect circular references", () => {
    expect(valueOf({ A1: "=B1", B1: "=A1+1" }, "A1")).toBe("CIRC");
  });
  it("should propagate errors in functions", () => {
    expect(valueOf({ A1: "=1/0", B1: "=SUM(A1:A2)" }, "B1")).toBe("DIV0");
  });
});

describe("content", () => {
  it("should convert french formulas", () => {
    expect(toCanonical("=somme(A1:b2; 1,5)", FR)).toBe("=SUM(A1:B2, 1.5)");
    expect(toLocal("=SUM(A1:B2, 1.5)", FR)).toBe("=SOMME(A1:B2; 1,5)");
  });
  it("should convert italian formulas with dots in their names", () => {
    expect(toCanonical("=CONTA.NUMERI(A1:A3)", IT)).toBe("=COUNT(A1:A3)");
    expect(toLocal("=COUNTA(A1:A3)", IT)).toBe("=CONTA.VALORI(A1:A3)");
  });
  it("should not take german ANZAHL2 for a reference", () => {
    const DE: Locale = {
      ...FR,
      functions: { SUM: "SUMME", COUNT: "ANZAHL", COUNTA: "ANZAHL2", AVERAGE: "MITTELWERT" },
    };
    expect(toCanonical("=ANZAHL2(A1:A3)+anzahl(B1)", DE)).toBe("=COUNTA(A1:A3)+COUNT(B1)");
  });
  it("should accept english names in any language", () => {
    expect(toCanonical("=SUM(A1:A3)", FR)).toBe("=SUM(A1:A3)");
  });
  it("should keep absolute markers", () => {
    expect(toCanonical("=$a1+A$2+$a$3", FR)).toBe("=$A1+A$2+$A$3");
  });
  it("should convert numbers", () => {
    expect(toCanonical("3,5", FR)).toBe("3.5");
    expect(toCanonical("3.5", FR)).toBe("3.5");
    expect(toCanonical("3,5", CANONICAL)).toBe("3,5");
    expect(toLocal("3.5", FR)).toBe("3,5");
  });
  it("should format values", () => {
    expect(formatValue(0.1 + 0.2, FR)).toBe("0,3");
    expect(formatValue(new FormulaError("VALUE"), FR)).toBe("#VALEUR!");
  });
});

describe("fill", () => {
  const source = { top: 0, left: 0, bottom: 0, right: 0 };
  it("should compute the fill target along the main axis", () => {
    expect(computeFillTarget(source, { col: 1, row: 4 })).toEqual({ ...source, bottom: 4 });
    expect(computeFillTarget(source, { col: 3, row: 1 })).toEqual({ ...source, right: 3 });
    expect(computeFillTarget(source, { col: 0, row: 0 })).toBeNull();
  });
  it("should shift relative references", () => {
    expect(shiftFormula("=A1+$A1+A$1+$A$1", 2, 1)).toBe("=B3+$A3+B$1+$A$1");
    expect(shiftFormula("=SUM(A1:B2)", 1, 0)).toBe("=SUM(A2:B3)");
    expect(shiftFormula("=A1", -1, 0)).toBe("=#REF!");
  });
  it("should copy a single number", () => {
    const cells = fill({ A1: "5" }, source, { ...source, bottom: 2 });
    expect(cells).toEqual({ A1: "5", A2: "5", A3: "5" });
  });
  it("should extend a series of numbers", () => {
    const rect = { top: 0, left: 0, bottom: 1, right: 0 };
    expect(fill({ A1: "1", A2: "3" }, rect, { ...rect, bottom: 4 })).toEqual({
      A1: "1",
      A2: "3",
      A3: "5",
      A4: "7",
      A5: "9",
    });
  });
  it("should extend a series upward", () => {
    const rect = { top: 2, left: 0, bottom: 3, right: 0 };
    const cells = fill({ A3: "10", A4: "20" }, rect, { ...rect, top: 0 });
    expect(cells).toEqual({ A1: "-10", A2: "0", A3: "10", A4: "20" });
  });
  it("should increment text ending with a number", () => {
    const cells = fill({ A1: "Item 9" }, source, { ...source, right: 2 });
    expect(cells).toEqual({ A1: "Item 9", B1: "Item 10", C1: "Item 11" });
  });
  it("should copy formulas and shift them", () => {
    const rect = { top: 0, left: 1, bottom: 0, right: 1 };
    const cells = fill({ B1: "=A1*$E$1" }, rect, { ...rect, bottom: 2 });
    expect(cells.B2).toBe("=A2*$E$1");
    expect(cells.B3).toBe("=A3*$E$1");
  });
  it("should repeat mixed patterns and copy blanks", () => {
    const rect = { top: 0, left: 0, bottom: 1, right: 0 };
    const cells = fill({ A1: "x", A4: "old" }, rect, { ...rect, bottom: 3 });
    expect(cells).toEqual({ A1: "x", A3: "x" });
  });
});
