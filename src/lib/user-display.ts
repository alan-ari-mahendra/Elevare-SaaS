/** Display helpers for session / profile data (shared by header & sidebar). */

export function userDisplayName(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name?.trim()) return name.trim();
  if (email?.trim()) return email.trim();
  return "User";
}

/** First letter of each name word (e.g. "John Doe" → "JD"), same as the old mock UI. */
export function userDisplayInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length > 0) {
    return parts.map((p) => p[0]).join("").toUpperCase();
  }
  if (email?.trim()) {
    return email.trim()[0].toUpperCase();
  }
  return "?";
}
