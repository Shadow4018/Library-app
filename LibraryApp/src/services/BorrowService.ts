import { MAX_BOOKS_PER_USER } from '../constants';
import type { Book } from '../models/Book';
import type { User } from '../models/User';
import type { Library } from './Library';

export type BorrowFailureReason =
  'BOOK_NOT_FOUND' | 'USER_NOT_FOUND' | 'ALREADY_BORROWED' | 'LIMIT_REACHED';

export type BorrowResult =
  { success: true; book: Book; user: User } | { success: false; reason: BorrowFailureReason };

/**
 * Бізнес-логіка позичання/повернення книг та видалення сутностей.
 * Тримає в узгодженому стані обидві колекції (книги <-> користувачі) і не чіпає DOM.
 */
export class BorrowService {
  constructor(
    private readonly books: Library<Book>,
    private readonly users: Library<User>,
    private readonly maxBooksPerUser: number = MAX_BOOKS_PER_USER,
  ) {}

  borrow(bookId: string, userId: string): BorrowResult {
    const book = this.books.findById(bookId);
    if (!book) {
      return { success: false, reason: 'BOOK_NOT_FOUND' };
    }
    const user = this.users.findById(userId);
    if (!user) {
      return { success: false, reason: 'USER_NOT_FOUND' };
    }
    if (book.isBorrowed()) {
      return { success: false, reason: 'ALREADY_BORROWED' };
    }
    if (user.getBorrowedBookIds().length >= this.maxBooksPerUser) {
      return { success: false, reason: 'LIMIT_REACHED' };
    }

    book.borrow(user.getId());
    user.addBorrowedBook(book.getId());
    return { success: true, book, user };
  }

  /** Повертає книгу; якщо книги немає або вона не була позичена - undefined. */
  returnBook(bookId: string): Book | undefined {
    const book = this.books.findById(bookId);
    if (!book || !book.isBorrowed()) {
      return undefined;
    }

    const borrowerId = book.getBorrowedBy();
    book.returnBook();
    if (borrowerId) {
      this.users.findById(borrowerId)?.removeBorrowedBook(book.getId());
    }
    return book;
  }

  /** Видаляє книгу, попередньо звільнивши ліміт користувача, який її тримав. */
  removeBook(bookId: string): boolean {
    this.returnBook(bookId);
    return this.books.remove(bookId);
  }

  /** Видаляє користувача; усі його книги автоматично стають доступними для позичання. */
  removeUser(userId: string): boolean {
    const user = this.users.findById(userId);
    if (!user) {
      return false;
    }
    user.getBorrowedBookIds().forEach((bookId) => this.books.findById(bookId)?.returnBook());
    return this.users.remove(userId);
  }
}
