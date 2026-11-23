import { WrittenTeacherUpload } from "@/service/calls/written";
import { useServiceWrittenResults } from "@/service/hooks/written";

export interface ExpectedFileUploads {
  /** Name of the expected file. */
  slot: string;
  /** Files uploaded by the student for this slot (several if they used more than one computer). */
  uploads: WrittenTeacherUpload[];
}

/**
 * Results of a written production, restricted to the files uploaded by `student`,
 * and sorted by expected file.
 * Caveat: two students with the same nickname cannot be told apart here,
 * their uploads are shown together (the hash of the computer is displayed for each file).
 */
export function useStudentWritten(classroom: string, writtenId: number, student: string) {
  const results = useServiceWrittenResults({ classroomCode: classroom, writtenId });
  const uploads = results.data?.uploads.filter((upload) => upload.nickname === student) ?? [];
  const slots: ExpectedFileUploads[] = (results.data?.files ?? []).map((file) => ({
    slot: file.name,
    uploads: uploads.filter((upload) => upload.slot === file.name),
  }));

  return {
    isLoading: results.isLoading,
    error: results.error,
    name: results.data?.name,
    slots,
    uploadedCount: slots.filter((slot) => slot.uploads.length > 0).length,
  };
}
