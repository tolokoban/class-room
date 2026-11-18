import { DemoHandler } from "../../context";
import add from "./add";
import remove from "./delete";
import get from "./get";
import list from "./list";
import notesGet from "./notes-get";
import notesSet from "./notes-set";
import replace from "./replace";

/**
 * Keys are the names of the folders in `backend/www/api/entrypoint/file/`.
 */
export const FILE: Record<string, DemoHandler> = {
  add,
  delete: remove,
  get,
  list,
  "notes-get": notesGet,
  "notes-set": notesSet,
  replace,
};
