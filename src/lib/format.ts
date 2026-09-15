/** Date formatting shared by cards and article headers. */

/** Short form for cards: "Aug 6, 2026". An undated note is a living note. */
export function formatCardDate(date: string) {
  if (!date) return "Living note";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Long form for an article header: "August 6, 2026". */
export function formatArticleDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** The canonical in-site path for a document. */
export function documentPath(slug: string) {
  return `/blogs/${encodeURIComponent(slug)}`;
}
