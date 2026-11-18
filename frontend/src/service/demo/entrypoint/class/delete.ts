import { DemoContext, field, isInt } from "../../context";

/**
 * Translation of `backend/www/api/entrypoint/class/delete/index.php`.
 * The files, uploads, seats, results... are deleted by cascade.
 */
export default async function classDelete(input: unknown, ctx: DemoContext): Promise<unknown> {
  const id = field(input, "id");
  if (!isInt(id)) return -20401;

  const row = await ctx.db.get("class", id);
  if (!row) return -20402;
  if (row.user !== ctx.user.id) return -20403;

  await ctx.db.delete("class", id);
  return 0;
}
