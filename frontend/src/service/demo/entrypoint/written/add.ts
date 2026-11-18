import { DemoContext } from "../../context";
import { sameText } from "../../lib/class";
import { parseWrittenInput } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/add/index.php`.
 */
export default async function writtenAdd(input: unknown, ctx: DemoContext): Promise<unknown> {
  const data = parseWrittenInput(input);
  if (data === false) return -60201;

  // UNIQUE (`user`, `name`)
  const duplicate = await ctx.db.findOne(
    "written",
    (row) => row.user === ctx.user.id && sameText(row.name, data.name),
  );
  if (duplicate) return -60202;

  return ctx.db.insert("written", {
    user: ctx.user.id,
    name: data.name,
    description: data.description,
    duration: data.duration,
    expiration: data.expiration,
    files: JSON.stringify(data.files),
  });
}
