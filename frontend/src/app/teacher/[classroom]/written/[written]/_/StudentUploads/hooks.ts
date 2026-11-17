import { useLangValue } from "@tolokoban/react-state";

import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import { getWrittenZipUrl, WrittenRef, WrittenTeacherUpload } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceWrittenFilesDelete } from "@/service/hooks/written";
import { getWrittenViewerKind } from "@/utils/viewer";

import { useTranslation } from "./translation";

export interface StudentGroup {
  /** Nickname and hash of the computer: two students can have the same nickname. */
  key: string;
  nickname: string;
  hash: string;
  uploads: WrittenTeacherUpload[];
}

export function useStudentUploads(writtenRef: WrittenRef, uploads: WrittenTeacherUpload[]) {
  const tr = useTranslation();
  const lang = useLangValue();
  const formatSize = useHumanSize();
  const translateError = useApiErrorTranslator();
  const deleting = useServiceWrittenFilesDelete();
  const groups = groupByStudent(uploads);
  const size = uploads.reduce((total, upload) => total + upload.size, 0);

  const deleteAll = () => {
    deleting
      .mutate(writtenRef)
      .then((count) => Notif.info(tr.deletedAll$(String(count))))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    groups,
    summary: tr.summary$(String(groups.length), String(uploads.length), formatSize(size)),
    formatTime: (time: number) =>
      new Date(time * 1000).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" }),
    zipUrl: getWrittenZipUrl(writtenRef),
    hasViewer: (upload: WrittenTeacherUpload) => getWrittenViewerKind(upload) !== null,
    viewerUrl: (upload: WrittenTeacherUpload) =>
      `#/teacher/${writtenRef.classroomCode}/written/${writtenRef.writtenId}/view/${upload.id}`,
    isDeleting: deleting.isPending,
    deleteAll,
  };
}

function groupByStudent(uploads: WrittenTeacherUpload[]): StudentGroup[] {
  const groups = new Map<string, StudentGroup>();
  for (const upload of uploads) {
    const key = `${upload.nickname}/${upload.hash}`;
    const group = groups.get(key) ?? {
      key,
      nickname: upload.nickname,
      hash: upload.hash,
      uploads: [],
    };
    group.uploads.push(upload);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => a.nickname.localeCompare(b.nickname));
}
