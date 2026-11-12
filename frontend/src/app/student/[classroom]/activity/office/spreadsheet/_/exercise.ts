import { type Notion } from "./NotionList";
import { type Cells } from "./Sheet/engine/address";

export interface Exercise {
  title: Record<string, string>;
  /** Forbid copying the cells of the expected sheet. */
  nocopy?: boolean;
  /** Content of the student's sheet at the beginning. Empty by default. */
  initial?: Cells;
  /** Sheet the student must reproduce. */
  expected: Cells;
  /**
   * Cells (like `"B2"`) whose formula should use at least one `$` in its references.
   * A sheet without them is still accepted, but the student gets a hint.
   */
  mustUseDollar?: string[];
  /**
   * Notions needed to solve the exercise (see `NotionList/translation`).
   * They are listed to the student after a failure or a partial success.
   */
  notions?: Notion[];
}
