import { type Cells } from "./Sheet/engine/address";

export interface Exercise {
  title: Record<string, string>;
  /** Content of the student's sheet at the beginning. Empty by default. */
  initial?: Cells;
  /** Sheet the student must reproduce. */
  expected: Cells;
}
