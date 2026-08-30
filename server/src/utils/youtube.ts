/** Accepts a full YouTube URL or a bare video ID and returns the ID, or null if invalid. */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const pattern = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
  const match = trimmed.match(pattern);
  if (match) return match[1];

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  return null;
}
