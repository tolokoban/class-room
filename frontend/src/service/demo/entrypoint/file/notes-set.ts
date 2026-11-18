import { DemoContext, field, isNonEmptyString } from "../../context";
import { findClassByCode } from "../../lib/activity";
import { findNotesFile, NOTES_FILE_NAME, NOTES_MIME } from "../../lib/file";

/**
 * Translation of `backend/www/api/entrypoint/file/notes-set/index.php`.
 */
export default async function fileNotesSet(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const content = field(input, "content");
  if (!isNonEmptyString(classroomCode) || typeof content !== "string") return -50701;

  const classroom = await findClassByCode(ctx, classroomCode);
  if (classroom === false) return -50702;
  if (classroom.user !== ctx.user.id) return -50703;

  const blob = new Blob([content], { type: NOTES_MIME });
  const notes = await findNotesFile(ctx, classroom.id);
  let notesId: number;
  if (notes === false) {
    notesId = await ctx.db.insert("files", {
      classroom: classroom.id,
      name: NOTES_FILE_NAME,
      size: blob.size,
      mime: NOTES_MIME,
    });
  } else {
    notesId = notes.id;
    await ctx.db.update("files", notesId, { size: blob.size });
  }
  await ctx.db.setContent("files", notesId, blob);
  return 0;
}
