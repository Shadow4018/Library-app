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
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  remove(): void {
    window.localStorage.removeItem(this.key);
  }

  clear(): void {
    window.localStorage.clear();
  }
}
