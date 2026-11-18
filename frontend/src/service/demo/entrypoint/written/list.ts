import { DemoContext } from "../../context";
import { compareText } from "../../lib/class";
import { formatWritten, getWrittenInfos } from "../../lib/written";

/**
 * Translation of `backend/www/api/entrypoint/written/list/index.php`.
 */
export default async function writtenList(_input: unknown, ctx: DemoContext): Promise<unknown> {
  const rows = (await ctx.db.where("written", (row) => row.user === ctx.user.id)).sort((a, b) =>
    compareText(a.name, b.name),
  );
  const classes = new Map(
    (await ctx.db.where("class", (row) => row.user === ctx.user.id)).map((row) => [row.id, row]),
  );
  const assignments = await ctx.db.all("written_assignment");

  const classrooms = new Map<number, string[]>();
  for (const assignment of assignments) {
    const classRow = classes.get(assignment.classroom);
    if (!classRow) continue;

    const codes = classrooms.get(assignment.written) ?? [];
    codes.push(classRow.code);
    classrooms.set(assignment.written, codes);
  }
  for (const codes of classrooms.values()) codes.sort(compareText);

  const writtenOfAssignment = new Map(assignments.map((row) => [row.id, row.written]));
  const uploads = new Map<number, Record<string, number>>();
  for (const upload of await ctx.db.where("written_upload", (row) => row.complete === 1)) {
    const writtenId = writtenOfAssignment.get(upload.assignment);
    if (writtenId === undefined) continue;

    const counts = uploads.get(writtenId) ?? {};
    counts[upload.slot] = (counts[upload.slot] ?? 0) + 1;
    uploads.set(writtenId, counts);
  }

  const result: unknown[] = [];
  for (const row of rows) {
    const written = await getWrittenInfos(ctx, formatWritten(row));
    result.push({
      ...written,
      classrooms: classrooms.get(written.id) ?? [],
      uploads: uploads.get(written.id) ?? {},
    });
  }
  return result;
}
