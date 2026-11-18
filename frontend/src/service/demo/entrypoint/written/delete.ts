import { DemoContext, field } from "../../context";
import {
  clearWrittenActivity,
  deleteAttachments,
  deleteUploads,
  resolveOwnedWritten,
} from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/delete/index.php`.
 */
export default async function writtenDelete(input: unknown, ctx: DemoContext): Promise<unknown> {
  const written = await resolveOwnedWritten(ctx, field(input, "id"), 60400);
  if (typeof written === "number") return written;

  await deleteUploads(ctx, (_u, a) => a.written === written.id);
  await deleteAttachments(ctx, (row) => row.written === written.id);
  await clearWrittenActivity(ctx, written.id, (row) => row.user === written.user);
  await ctx.db.delete("written", written.id);
  return 0;
}
