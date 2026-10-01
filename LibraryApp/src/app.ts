console.log("Webpack та TypeScript працюють!");

import './styles/main.scss';
import { Book, type BookDTO } from './models/Book.js';
import { User, type UserDTO } from './models/User.js';
import { Library } from './services/Library.js';
import { Storage } from './services/Storage.js';
import { Validation } from './utils/validators.js';
import { showModal, showPromptModal } from './ui/components/Modal.js';
import { render } from './ui/render.js';

const MAX_BOOKS_PER_USER = 3;
const BOOKS_STORAGE_KEY = 'library_books';
const USERS_STORAGE_KEY = 'library_users';

class App {
  private readonly container: HTMLElement;
  private readonly bookStorage = new Storage<BookDTO>(BOOKS_STORAGE_KEY);
  private readonly userStorage = new Storage<UserDTO>(USERS_STORAGE_KEY);

  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;
  private searchQuery = '';

  constructor(container: HTMLElement) {
    this.container = container;
    this.bookLibrary = new Library<Book>(this.bookStorage.load().map(Book.fromJSON));
    this.userLibrary = new Library<User>(this.userStorage.load().map(User.fromJSON));
    this.renderApp();
  }

  private persistBooks(): void {
    this.bookStorage.save(this.bookLibrary.getAll().map((book) => book.toJSON()));
  }

  private persistUsers(): void {
    this.userStorage.save(this.userLibrary.getAll().map((user) => user.toJSON()));
  }

  private renderApp(): void {
    render(
      this.container,
      { books: this.bookLibrary.getAll(), users: this.userLibrary.getAll(), searchQuery: this.searchQuery },
      {
        onAddBook: (book) => this.handleAddBook(book),
        onAddUser: (user) => this.handleAddUser(user),
        bookList: {
          onBorrow: (book) => this.handleBorrowClick(book),
          onReturn: (book) => this.handleReturn(book),
          onDelete: (book) => this.handleDeleteBook(book),
          onSearch: (query) => this.handleSearch(query),
        },
        userList: {
          onDelete: (user) => this.handleDeleteUser(user),
        },
      },
    );
  }

  private handleAddBook(book: Book): void {
    this.bookLibrary.add(book);
    this.persistBooks();
    this.renderApp();
  }

  private handleAddUser(user: User): void {
    this.userLibrary.add(user);
    this.persistUsers();
    this.renderApp();
  }

  private handleDeleteBook(book: Book): void {
    this.bookLibrary.remove(book.getId());
    this.persistBooks();
    this.renderApp();
  }

  private handleDeleteUser(user: User): void {
    this.userLibrary.remove(user.getId());
    this.persistUsers();
    this.renderApp();
  }

  private handleSearch(query: string): void {
    this.searchQuery = query;
    this.renderApp();
  }

  private handleBorrowClick(book: Book): void {
    showPromptModal({
      title: 'Введіть ID користувача для позичення книги:',
      placeholder: 'ID',
      onSave: (value) => {
        const idValidation = Validation.validateUserIdInput(value);
        if (!idValidation.isValid) {
          return idValidation.errors.userId;
        }

        const user = this.userLibrary.findById(value);
        if (!user) {
          return 'Користувача з таким ID не знайдено';
        }

        if (user.getBorrowedBookIds().length >= MAX_BOOKS_PER_USER) {
          return `Користувач ${user.getName()} вже має ${MAX_BOOKS_PER_USER} позичені книги. Поверніть одну з них, щоб позичити нову.`;
        }

        book.borrow(user.getId());
        user.addBorrowedBook(book.getId());
        this.persistBooks();
        this.persistUsers();
        this.renderApp();

        showModal({
          title: 'Книгу позичено',
          message: `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()}) has been borrowed by ${user.getId()} ${user.getName()} (${user.getEmail()}).`,
          type: 'success',
          confirmLabel: 'Зрозуміло!',
        });

        return undefined;
      },
    });
  }

  private handleReturn(book: Book): void {
    const userId = book.getBorrowedBy();
    const user = userId ? this.userLibrary.findById(userId) : undefined;

    book.returnBook();
    user?.removeBorrowedBook(book.getId());

    this.persistBooks();
    this.persistUsers();
    this.renderApp();

    showModal({
      title: 'Книгу повернено',
      message: `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()}) has been returned.`,
      type: 'info',
      confirmLabel: 'Закрити',
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (!container) {
    throw new Error('#app container not found');
  }
  new App(container);
});