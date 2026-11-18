import { DemoContext, field } from "../../context";
import { sameText } from "../../lib/class";
import { deleteUploads, parseWrittenInput, resolveOwnedWritten } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/update/index.php`.
 */
export default async function writtenUpdate(input: unknown, ctx: DemoContext): Promise<unknown> {
  const data = parseWrittenInput(input);
  if (data === false) return -60301;

  const written = await resolveOwnedWritten(ctx, field(input, "id"), 60300);
  if (typeof written === "number") return written;

  // UNIQUE (`user`, `name`)
  const duplicate = await ctx.db.findOne(
    "written",
    (row) => row.user === ctx.user.id && row.id !== written.id && sameText(row.name, data.name),
  );
  if (duplicate) return -60304;

  const newNames = data.files.map((file) => file.name);
  const removed = written.files.map((file) => file.name).filter((name) => !newNames.includes(name));

  await ctx.db.update("written", written.id, {
    name: data.name,
    description: data.description,
    duration: data.duration,
    expiration: data.expiration,
    files: JSON.stringify(data.files),
  });
  let deleted = 0;
  for (const slot of removed) {
    deleted += await deleteUploads(ctx, (u, a) => a.written === written.id && u.slot === slot);
  }
  // The expiration may have changed.
  const assignments = await ctx.db.where(
    "written_assignment",
    (row) => row.written === written.id && row.end_time !== null,
  );
  for (const row of assignments) {
    await ctx.db.put("written_assignment", {
      ...row,
      expires_at: (row.end_time ?? 0) + 3600 * (data.expiration + row.extension),
    });
  }

  return { deleted };
}
