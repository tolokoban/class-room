import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { findNotesFile } from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/notes-get/index.php`.
 */
export default async function fileNotesGet(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  if (!isNonEmptyString(classroomCode)) return -50601;

  const classroom = await findClassByCode(ctx, classroomCode);
  if (classroom === false) return -50602;
  if (classroom.user !== ctx.user.id) return -50603;

  const notes = await findNotesFile(ctx, classroom.id);
  if (notes === false) return "";

  const blob = await ctx.db.getContent("files", notes.id);
  if (!blob) return -50604;

  return blob.text();
}
