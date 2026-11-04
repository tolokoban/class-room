import { useRouteContext } from "@/app/routes";

const PREFIX = "/student/[classroom]/activity/";

/**
 * @returns The code of the activity displayed by the current route
 * (`"AI/chess"` for instance), or `null` if we are not on an activity page.
 */
export function useActivityCode(): string | null {
  const context = useRouteContext();
  const route = context?.route ?? "";
  if (!route.startsWith(PREFIX)) return null;

  const code = route.slice(PREFIX.length);
  return code.length > 0 ? code : null;
}
