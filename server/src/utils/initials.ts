/** Takes the first letter of the first two words of a name, e.g. "يوسف مصطفى" → "يم". */
export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]);
  return initials.join("") || "؟";
}
