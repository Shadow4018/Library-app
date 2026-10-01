/**
 * Обгортка над LocalStorage. Generic-параметр T описує тип
 * серіалізованих (DTO) даних, які зберігаються під конкретним ключем.
 */
export class Storage<T> {
  constructor(private readonly key: string) {}

  save(data: T[]): void {
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }

  load(): T[] {
    const raw = window.localStorage.getItem(this.key);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  /** Видаляє лише дані під ключем цього сховища. */
  remove(): void {
    window.localStorage.removeItem(this.key);
  }

  /** Повністю очищає LocalStorage (усі ключі). */
  clear(): void {
    window.localStorage.clear();
  }
}
