import { DemoHandler } from "../../context";
import add from "./add";
import remove from "./delete";
import list from "./list";
import update from "./update";

export const CLASS: Record<string, DemoHandler> = {
  add,
  delete: remove,
  list,
  update,
};
