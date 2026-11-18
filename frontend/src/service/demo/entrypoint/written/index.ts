import { DemoHandler } from "../../context";
import add from "./add";
import assign from "./assign";
import attachmentChunk from "./attachment-chunk";
import attachmentComplete from "./attachment-complete";
import attachmentDelete from "./attachment-delete";
import attachmentGet from "./attachment-get";
import attachmentInit from "./attachment-init";
import classroom from "./classroom";
import remove from "./delete";
import download from "./download";
import filesDelete from "./files-delete";
import list from "./list";
import reorder from "./reorder";
import results from "./results";
import state from "./state";
import timer from "./timer";
import unassign from "./unassign";
import update from "./update";
import uploadChunk from "./upload-chunk";
import uploadComplete from "./upload-complete";
import uploadDelete from "./upload-delete";
import uploadInit from "./upload-init";
import zip from "./zip";

/**
 * Keys are the names of the folders in `backend/www/api/entrypoint/written/`.
 */
export const WRITTEN: Record<string, DemoHandler> = {
  add,
  assign,
  "attachment-chunk": attachmentChunk,
  "attachment-complete": attachmentComplete,
  "attachment-delete": attachmentDelete,
  "attachment-get": attachmentGet,
  "attachment-init": attachmentInit,
  classroom,
  delete: remove,
  download,
  "files-delete": filesDelete,
  list,
  reorder,
  results,
  state,
  timer,
  unassign,
  update,
  "upload-chunk": uploadChunk,
  "upload-complete": uploadComplete,
  "upload-delete": uploadDelete,
  "upload-init": uploadInit,
  zip,
};
