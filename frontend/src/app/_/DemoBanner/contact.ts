/**
 * Open the email client to write to the administrator of the website.
 * The address is built at click time, so that it never appears as a whole
 * in the bundle, where email scrapers could find it.
 */
export function contactAdmin() {
  const user = "contact";
  const domain = ["tolokoban", "org"].join(".");
  window.location.href = `mailto:${user}@${domain}`;
}
