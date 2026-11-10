I need a new activity to train students to use and understand Excel formulas.
Take inspiration from `frontend/src/app/student/[classroom]/activity/office/file-explorer` and `frontend/src/app/student/[classroom]/activity/office/selection` for the two columns layout with the right being the target to reach.

For this activity we need a component that emulate a simple Excel sheet:

1. A first input box at the top where you can enter the content of the currently active cell (if the content sytart with a "=" this a formula)
2. Simples formulas must understand the absolute and relative cells addressing. For instance "A3", "$A3", "A$3, "$A$3", ...
3. It must understand ranges. Example: "A1:D1".
4. The simple operators "+", "-", "*" and "/" must work in formulas.
5. The followinf functions must be implemented and their name depend on the current language of the user:

- `SUM()`: add the cells of a range
- `COUNT()`: count the cells of a range
- `COUNTA()`: count non-empty cells of a range
- `AVERAGE()`: average the cells of a range
  