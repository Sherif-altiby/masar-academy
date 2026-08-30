/**
 * Generates a URL-safe slug. Arabic titles have no Latin characters to slugify
 * cleanly, so Arabic input falls back to a short random suffix appended to
 * "course" rather than producing an empty/garbled slug.
 */
export default function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\u0000-\u007F]/g, "") // strip non-ASCII (e.g. Arabic) chars
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base) return base;

  return `course-${Math.random().toString(36).slice(2, 8)}`;
}
