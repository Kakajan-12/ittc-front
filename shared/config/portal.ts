/**
 * Participant portal — a separate application where delegates sign in. It is
 * not part of this site, so the URL is absolute.
 */
const PARTICIPANT_PORTAL_URL = "https://event.oguzforum.com";

/**
 * Deep-links straight to the portal's sign-in page in the language the visitor
 * is reading the site in. The portal serves /en, /ru and /tk; its root only
 * redirects to a landing page, which is not what a "Login" button should open.
 */
export function portalLoginUrl(locale: string): string {
  return `${PARTICIPANT_PORTAL_URL}/${locale}/login`;
}
