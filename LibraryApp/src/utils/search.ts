interface Searchable {
  getTitle(): string;
  getAuthor(): string;
}

/** Пошук за назвою або автором (без урахування регістру). Порожній запит повертає всі елементи. */
export function filterBooks<T extends Searchable>(books: readonly T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...books];
  }
  return books.filter(
    (book) =>
      book.getTitle().toLowerCase().includes(q) || book.getAuthor().toLowerCase().includes(q),
  );
}
