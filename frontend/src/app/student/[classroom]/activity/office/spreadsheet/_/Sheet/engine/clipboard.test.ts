import { describe, expect, it } from "vitest";

import { copyCells, parseClipboardText, pasteCells } from "./clipboard";
import { evaluateSheet } from "./evaluate";
import { CANONICAL } from "./locale";

const CELLS = { A1: "2", A2: "3", B1: "=A1*10", B2: "=$A$2+A1" };
const RECT = { top: 0, left: 0, bottom: 1, right: 1 };

describe("clipboard", () => {
  it("copies the values only", () => {
    const data = copyCells(CELLS, evaluateSheet(CELLS), RECT, CANONICAL, true);
    expect(data.text).toBe("2\t20\n3\t5");
    expect(data.raws).toEqual([
      ["2", "20"],
      ["3", "5"],
    ]);
  });

  it("copies the formulas and shifts them when pasted", () => {
    const data = copyCells(CELLS, evaluateSheet(CELLS), RECT, CANONICAL, false);
    expect(data.text).toBe("2\t=A1*10\n3\t=$A$2+A1");
    const { cells, rect } = pasteCells({}, data, { col: 2, row: 3 });
    expect(cells).toEqual({ C4: "2", C5: "3", D4: "=C4*10", D5: "=$A$2+C4" });
    expect(rect).toEqual({ top: 3, left: 2, bottom: 4, right: 3 });
  });

  it("ignores the cells outside the grid and clears the empty ones", () => {
    const data = parseClipboardText("1\t\t3\n", CANONICAL);
    const { cells, rect } = pasteCells({ E1: "x", D1: "y" }, data, { col: 3, row: 0 });
    expect(cells).toEqual({ D1: "1" });
    expect(rect).toEqual({ top: 0, left: 3, bottom: 0, right: 4 });
  });
});
