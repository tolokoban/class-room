import { DemoContext, field, hasField, isInt } from "../../context";
import { ClassRow } from "../../db/tables";
import { isClassCodeUsed } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/class/update/index.php`.
 */
export default async function classUpdate(input: unknown, ctx: DemoContext): Promise<unknown> {
  const id = field(input, "id");
  if (!isInt(id)) return -20301;

  const fields: Partial<ClassRow> = {};
  for (const key of ["code", "name", "description"] as const) {
    if (!hasField(input, key)) continue;

    const raw = field(input, key);
    if (typeof raw !== "string") return -20301;

    let value = raw;
    if (key !== "description") {
      value = value.trim();
      if (value === "") return -20301;
    }
    fields[key] = value;
  }
  if (hasField(input, "maxStudents")) {
    const maxStudents = field(input, "maxStudents");
    if (!isInt(maxStudents) || maxStudents < 1 || maxStudents > 1000) return -20301;

    fields.max_students = maxStudents;
  }

  const row = await ctx.db.get("class", id);
  if (!row) return -20302;
  if (row.user !== ctx.user.id) return -20303;
  if (Object.keys(fields).length === 0) return 0;
  if (fields.code !== undefined && (await isClassCodeUsed(ctx, fields.code, id))) return -20304;

  await ctx.db.update("class", id, fields);
  return 0;
}
