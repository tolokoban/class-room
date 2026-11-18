import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { compareText, sameText } from "../../lib/class";
import { NOTES_FILE_NAME, registerFileUrl } from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/list/index.php`.
 * It also registers the content of each file, so that the links
 * of `getFileUrl()` work in demo mode.
 */
export default async function fileList(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  if (!isNonEmptyString(classroomCode)) return -50401;

  const classroom = await findClassByCode(ctx, classroomCode);
  if (classroom === false) return -50402;
  if (classroom.user !== ctx.user.id) return -50403;

  const rows = await ctx.db.where(
    "files",
    (row) => row.classroom === classroom.id && !sameText(row.name, NOTES_FILE_NAME),
  );
  rows.sort((a, b) => compareText(a.name, b.name));
  for (const row of rows) {
    const blob = await ctx.db.getContent("files", row.id);
    if (blob) registerFileUrl(row.id, blob, row.mime);
  }

  return rows.map((row) => ({ id: row.id, name: row.name, size: row.size, mime: row.mime }));
}
