/** A URL with a scheme (`https:`, `mailto:`...) or starting with `//`. */
const ABSOLUTE_URL = /^([a-z][a-z\d+.-]*:|\/\/)/i;

/**
 * @returns `true` if `href` leaves the application (it is not relative, like `#/teacher`).
 */
export function isAbsoluteUrl(href: string | undefined): boolean {
  return ABSOLUTE_URL.test(href ?? "");
}
