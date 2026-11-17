import { matchRoute } from "@/app/routes";

/** For instance `AI/RAG` or `written/12`, but not `written/[written]`. */
const ACTIVITY_CODE_PATTERN = /^[\w-]+(\/[\w-]+)*$/;

/**
 * @returns The path of the page of an activity for a student
 * (for instance `/student/3A/activity/written/12`),
 * or `null` if there is no page for this activity code.
 */
export function getStudentActivityPath(classroom: string, activityCode: string): string | null {
  if (!ACTIVITY_CODE_PATTERN.test(activityCode)) return null;

  const path = `/student/${classroom}/activity/${activityCode}`;
  const match = matchRoute(path);
  return match?.full ? path : null;
}
