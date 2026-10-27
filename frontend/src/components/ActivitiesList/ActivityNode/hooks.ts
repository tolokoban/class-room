/**
 * @returns The hash URL of the activity page at `path`,
 * for the classroom of the current route.
 */
export function useActivityHref(path: string[]): string {
  const classroom = "0";
  return `#/student/${classroom}/activity/${path.join("/")}`;
}
