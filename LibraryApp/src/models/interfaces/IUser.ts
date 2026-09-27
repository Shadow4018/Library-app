export interface IUser {
  getId(): string;
  getName(): string;
  getEmail(): string;
  getBorrowedBookIds(): string[];
  addBorrowedBook(bookId: string): void;
  removeBorrowedBook(bookId: string): void;
}
