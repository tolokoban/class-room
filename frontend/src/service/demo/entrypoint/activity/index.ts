import { DemoHandler } from "../../context";
import clear from "./clear";
import current from "./current";
import currentSet from "./current-set";
import resultAll from "./result-all";
import resultGet from "./result-get";
import resultSet from "./result-set";

/**
 * Keys are the names of the folders in `backend/www/api/entrypoint/activity/`.
 */
export const ACTIVITY: Record<string, DemoHandler> = {
  clear,
  current,
  "current-set": currentSet,
  "result-all": resultAll,
  "result-get": resultGet,
  "result-set": resultSet,
};
