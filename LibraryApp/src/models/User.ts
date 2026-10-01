import type { IUser } from './interfaces/IUser';
import { generateId } from '../utils/idGenerator';

/** Серіалізоване представлення користувача (для збереження в LocalStorage). */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  borrowedBookIds: string[];
}

export class User implements IUser {
  private readonly id: string;
  private name: string;
  private email: string;
  private borrowedBookIds: string[];

  constructor(
    name: string,
    email: string,
    id: string = generateId(),
    borrowedBookIds: string[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.borrowedBookIds = [...borrowedBookIds];
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getBorrowedBookIds(): string[] {
    return [...this.borrowedBookIds];
  }

  addBorrowedBook(bookId: string): void {
    if (!this.borrowedBookIds.includes(bookId)) {
      this.borrowedBookIds.push(bookId);
    }
  }

  removeBorrowedBook(bookId: string): void {
    this.borrowedBookIds = this.borrowedBookIds.filter((id) => id !== bookId);
  }

  toJSON(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      borrowedBookIds: [...this.borrowedBookIds],
    };
  }

  static fromJSON(dto: UserDTO): User {
    return new User(dto.name, dto.email, dto.id, dto.borrowedBookIds);
  }
}
