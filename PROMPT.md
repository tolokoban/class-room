I need a new activity to train students to use and understand Excel formulas.
Take inspiration from `frontend/src/app/student/[classroom]/activity/office/file-explorer` and `frontend/src/app/student/[classroom]/activity/office/selection` for the two columns layout with the right being the target to reach.

For this activity we need a component that emulates a simple Excel sheet:

1. A first input box at the top where you can enter the content of the currently active cell (if the content sytart with a "=" this a formula)
2. Simples formulas must understand the absolute and relative cells addressing. For instance "A3", "$A3", "A$3, "$A$3", ...
3. It must understand ranges. Example: "A1:D1".
4. The simple operators "+", "-", "*" and "/" must work in formulas.
5. The followinf functions must be implemented and their name depend on the current language of the user:
    - `SUM()`: add the cells of a range
    - `COUNT()`: count the cells of a range
    - `COUNTA()`: count non-empty cells of a range
    - `AVERAGE()`: average the cells of a range
  
Cells can be selected with the keyboard and with the mouse.
Use only 5 columns and 30 rows oin the grid, and make it scrollable.

There must be this little square at the bottom right of the rectangle that marks the active cell.
Its'called a Fill Handle.
If the user drags this Fill Handle, we must do the same as in Excel (or Libre Office Calc).

The sheet on the right column is read only because this is the target the student has to achieve.

For now, I just want an empty exercise. That means that the left and right columns must show an empty sheet and we don't check if the sheet match.
I just want to see if the left sheet reacts as expected.
