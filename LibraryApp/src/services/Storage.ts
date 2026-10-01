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
<<<<<<< HEAD
      return JSON.parse(raw) as T[];
=======
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
    } catch {
      return [];
    }
  }

<<<<<<< HEAD
=======
  /** Видаляє лише дані під ключем цього сховища. */
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
  remove(): void {
    window.localStorage.removeItem(this.key);
  }

<<<<<<< HEAD
=======
  /** Повністю очищає LocalStorage (усі ключі). */
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
  clear(): void {
    window.localStorage.clear();
  }
}
