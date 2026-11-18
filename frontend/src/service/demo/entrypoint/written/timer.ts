import { DemoContext, field, isInt } from "../../context";
import {
  Assignment,
  computeExpiresAt,
  deleteUploads,
  getTimer,
  resolveAssignment,
  Written,
} from "../../lib/written";

const ACTIONS = ["start", "pause", "resume", "add", "extend", "reset"];
const LIMITS: Record<string, number> = { start: 24 * 60, add: 600, extend: 24 * 365 };

/**
 * Translation of `backend/www/api/entrypoint/written/timer/index.php`.
 */
export default async function writtenTimer(input: unknown, ctx: DemoContext): Promise<unknown> {
  const action = field(input, "action");
  const value = field(input, "value");
  const optional = action === "start" && value === null;
  if (
    typeof action !== "string" ||
    !ACTIONS.includes(action) ||
    (action in LIMITS && !optional && (!isInt(value) || value < 1 || value > LIMITS[action]))
  ) {
    return -60801;
  }
  const resolved = await resolveAssignment(
    ctx,
    field(input, "writtenId"),
    field(input, "classroomCode"),
    60800,
  );
  if (typeof resolved === "number") return resolved;

  const { written, assignment } = resolved;
  const next = computeNextTimer(ctx.now(), action, value as number | null, written, assignment);
  if (next === false) return -60807;

  if (action === "reset") await deleteUploads(ctx, (_u, a) => a.id === assignment.id);
  await ctx.db.update("written_assignment", assignment.id, {
    end_time: next.endTime,
    remaining: next.remaining,
    extension: next.extension,
    expires_at: next.expiresAt,
  });
  return getTimer(next);
}

function computeNextTimer(
  now: number,
  action: string,
  value: number | null,
  written: Written,
  assignment: Assignment,
): Assignment | false {
  const state = getTimer(assignment).state;
  const next = { ...assignment };
  switch (action) {
    case "start":
      if (state !== "idle") return false;
      next.endTime = now + 60 * (value ?? written.duration);
      break;
    case "pause":
      if (state !== "running") return false;
      next.remaining = (assignment.endTime ?? 0) - now;
      next.endTime = null;
      return next;
    case "resume":
      if (state !== "paused") return false;
      next.endTime = now + (assignment.remaining ?? 0);
      next.remaining = null;
      break;
    case "add":
      if (state === "idle") return false;
      if (state === "paused") {
        next.remaining = (next.remaining ?? 0) + 60 * (value ?? 0);
        return next;
      }
      next.endTime = (next.endTime ?? 0) + 60 * (value ?? 0);
      break;
    case "extend":
      if (state === "idle") return false;
      next.extension += value ?? 0;
      next.expiresAt =
        assignment.expiresAt === null ? null : assignment.expiresAt + 3600 * (value ?? 0);
      return next;
    case "reset":
      return { ...assignment, endTime: null, remaining: null, extension: 0, expiresAt: null };
  }
  next.expiresAt = computeExpiresAt(next.endTime ?? 0, written, next);
  return next;
}
