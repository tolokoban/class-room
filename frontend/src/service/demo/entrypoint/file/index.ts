import { DemoHandler } from "../../context";
import remove from "./delete";
import get from "./get";
import list from "./list";
import notesGet from "./notes-get";
import notesSet from "./notes-set";
import uploadChunk from "./upload-chunk";
import uploadComplete from "./upload-complete";
import uploadInit from "./upload-init";

/**
 * Keys are the names of the folders in `backend/www/api/entrypoint/file/`.
 */
export const FILE: Record<string, DemoHandler> = {
  delete: remove,
  get,
  list,
  "notes-get": notesGet,
  "notes-set": notesSet,
  "upload-chunk": uploadChunk,
  "upload-complete": uploadComplete,
  "upload-init": uploadInit,
};
