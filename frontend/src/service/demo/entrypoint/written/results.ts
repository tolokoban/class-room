import { DemoContext, field } from "../../context";
import { registerDemoUrl } from "../../urls";
import {
  collectWrittenGarbage,
  getComputerHash,
  getTimer,
  getUploadApiUrl,
  getUploadDownloadName,
  getWrittenInfos,
  getZipApiUrl,
  listUploads,
  resolveAssignment,
} from "../../lib/written";
import { makeZipOfUploads } from "./zip";

/**
 * Translation of `backend/www/api/entrypoint/written/results/index.php`.
 * The download links of the uploads and of the ZIP archive are registered for the demo mode.
 */
export default async function writtenResults(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const resolved = await resolveAssignment(ctx, field(input, "writtenId"), classroomCode, 60900);
  if (typeof resolved === "number") return resolved;

  const { written, assignment } = resolved;
  await collectWrittenGarbage(ctx);
  const list = await listUploads(ctx, assignment.id);
  const uploads: unknown[] = [];
  for (const upload of list) {
    const content = await ctx.db.getContent("written_upload", upload.id);
    if (content)
      registerDemoUrl(getUploadApiUrl(upload.id), new Blob([content], { type: upload.mime }));
    uploads.push({
      id: upload.id,
      nickname: upload.nickname,
      hash: await getComputerHash(upload.computer),
      slot: upload.slot,
      original: upload.original,
      mime: upload.mime,
      size: upload.size,
      late: upload.late,
      time: upload.time,
      downloadName: await getUploadDownloadName(
        upload.nickname,
        upload.slot,
        upload.computer,
        upload.ext,
      ),
    });
  }
  registerDemoUrl(
    getZipApiUrl(written.id, classroomCode as string),
    await makeZipOfUploads(ctx, list),
  );

  return {
    ...(await getWrittenInfos(ctx, written)),
    now: ctx.now(),
    timer: getTimer(assignment),
    uploads,
  };
}
