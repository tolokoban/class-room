import { useRouteContext } from "@/app/routes";

const PREFIX = "/student/[classroom]/activity/";

/**
 * @returns The code of the activity displayed by the current route
 * (`"AI/chess"` or `"written/12"` for instance), or `null` if we are not on an activity page.
 * The `[name]` parts of the route (`"written/[written]"`) are replaced by the values of
 * their params, because the backend only accepts actual codes.
 */
export function useActivityCode(): string | null {
  const context = useRouteContext();
  const route = context?.route ?? "";
  if (!route.startsWith(PREFIX)) return null;

  const params = context?.params ?? {};
  const code = route
    .slice(PREFIX.length)
    .split("/")
    .map((part) => (part.startsWith("[") ? (params[part.slice(1, -1)] ?? part) : part))
    .join("/");
  return code.length > 0 ? code : null;
}
