import { type Cells, cellKey, COLUMNS, ROWS } from "./Sheet/engine/address";

/**
 * Write a sheet as an exercise, ready to be pasted in `exercises.ts`.
 * Cells are sorted row by row.
 */
export function exerciseCode(cells: Cells): string {
  const lines = [
    "  newExercise: {",
    "    title: {",
    '      fr: "",',
    '      en: "",',
    '      de: "",',
    '      it: "",',
    "    },",
    "    expected: {",
  ];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const key = cellKey({ col, row });
      const raw = cells[key];
      if (raw !== undefined) lines.push(`      ${key}: ${JSON.stringify(raw)},`);
    }
  }
  lines.push("    },", "  },", "");
  return lines.join("\n");
}
