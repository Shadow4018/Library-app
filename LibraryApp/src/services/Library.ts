import type { Identifiable } from '../types/index.js';

/**
 * Узагальнена (generic) колекція об'єктів типу T.
 * T зобов'язаний мати метод getId(), щоб Library могла ідентифікувати елементи
 * незалежно від того, книги це, користувачі чи будь-яка інша сутність.
 */
export class Library<T extends Identifiable> {
  private items: T[];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  add(item: T): void {
    this.items.push(item);
  }

  remove(id: string): boolean {
    const lengthBefore = this.items.length;
    this.items = this.items.filter((item) => item.getId() !== id);
    return this.items.length !== lengthBefore;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.getId() === id);
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  getAll(): T[] {
    return [...this.items];
  }

  count(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}
