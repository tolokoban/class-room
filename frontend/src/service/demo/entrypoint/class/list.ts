import { DemoContext } from "../../context";
import { compareText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/class/list/index.php`.
 */
export default async function classList(_input: unknown, ctx: DemoContext): Promise<unknown> {
  const rows = await ctx.db.where("class", (row) => row.user === ctx.user.id);

  return rows
    .sort((a, b) => compareText(a.name, b.name))
    .map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      maxStudents: row.max_students,
    }));
}
