import type { IBook } from './interfaces/IBook.js';
import { generateId } from '../utils/idGenerator.js';

/** Серіалізоване представлення книги (для збереження в LocalStorage). */
export interface BookDTO {
  id: string;
  title: string;
  author: string;
  year: number;
  borrowed: boolean;
  borrowedBy: string | null;
}

export class Book implements IBook {
  private readonly id: string;
  private title: string;
  private author: string;
  private year: number;
  private borrowed: boolean;
  private borrowedBy: string | null;

  constructor(
    title: string,
    author: string,
    year: number,
    id: string = generateId(),
    borrowed: boolean = false,
    borrowedBy: string | null = null,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.borrowed = borrowed;
    this.borrowedBy = borrowedBy;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getAuthor(): string {
    return this.author;
  }

  setAuthor(author: string): void {
    this.author = author;
  }

  getYear(): number {
    return this.year;
  }

  setYear(year: number): void {
    this.year = year;
  }

  isBorrowed(): boolean {
    return this.borrowed;
  }

  getBorrowedBy(): string | null {
    return this.borrowedBy;
  }

  borrow(userId: string): void {
    this.borrowed = true;
    this.borrowedBy = userId;
  }

  returnBook(): void {
    this.borrowed = false;
    this.borrowedBy = null;
  }

  toJSON(): BookDTO {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      year: this.year,
      borrowed: this.borrowed,
      borrowedBy: this.borrowedBy,
    };
  }

  static fromJSON(dto: BookDTO): Book {
    return new Book(dto.title, dto.author, dto.year, dto.id, dto.borrowed, dto.borrowedBy);
  }
}
