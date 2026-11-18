import { DemoContext, field, isInt } from "../../context";
import { isClassCodeUsed } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/class/add/index.php`.
 */
export default async function classAdd(input: unknown, ctx: DemoContext): Promise<unknown> {
  const code = field(input, "code");
  const name = field(input, "name");
  const description = field(input, "description") ?? "";
  const maxStudents = field(input, "maxStudents") ?? 24;
  if (
    typeof code !== "string" ||
    code.trim() === "" ||
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof description !== "string" ||
    !isInt(maxStudents) ||
    maxStudents < 1 ||
    maxStudents > 1000
  ) {
    return -20101;
  }

  if (await isClassCodeUsed(ctx, code.trim())) return -20102;

  return ctx.db.insert("class", {
    user: ctx.user.id,
    code: code.trim(),
    name: name.trim(),
    description,
    activity: null,
    max_students: maxStudents,
  });
}
