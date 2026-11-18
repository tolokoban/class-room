import { DemoHandler } from "../../context";
import check from "./check";
import enter from "./enter";
import kick from "./kick";
import seats from "./seats";
import students from "./students";

/**
 * Keys are the names of the folders in `backend/www/api/entrypoint/room/`.
 */
export const ROOM: Record<string, DemoHandler> = {
  check,
  enter,
  kick,
  seats,
  students,
};
