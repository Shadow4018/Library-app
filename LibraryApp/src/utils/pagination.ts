export interface Page<T> {
  items: T[];
  /** Поточна сторінка (нумерація з 1), уже приведена до допустимого діапазону. */
  page: number;
  totalPages: number;
  totalItems: number;
}

/** Нарізає масив на сторінки. Некоректний номер сторінки автоматично приводиться до діапазону. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const start = (current - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    totalItems,
  };
}
