export interface IBook {
  getId(): string;
  getTitle(): string;
  getAuthor(): string;
  getYear(): number;
  isBorrowed(): boolean;
  getBorrowedBy(): string | null;
  borrow(userId: string): void;
  returnBook(): void;
}
