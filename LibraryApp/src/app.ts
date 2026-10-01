import './styles/main.scss';
import { BOOKS_STORAGE_KEY, USERS_STORAGE_KEY } from './constants';
import { Book, type BookDTO } from './models/Book';
import { User, type UserDTO } from './models/User';
import { BorrowService, type BorrowFailureReason } from './services/BorrowService';
import { Library } from './services/Library';
import { NotificationService } from './services/NotificationService';
import { Storage } from './services/Storage';
import { showModal, showPromptModal } from './ui/components/Modal';
import { mountApp, type AppView } from './ui/render';
import { Validation } from './utils/validators';

class App {
  private readonly bookStorage = new Storage<BookDTO>(BOOKS_STORAGE_KEY);
  private readonly userStorage = new Storage<UserDTO>(USERS_STORAGE_KEY);

  private readonly bookLibrary: Library<Book>;
  private readonly userLibrary: Library<User>;
  private readonly borrowService: BorrowService;
  private readonly notifications = new NotificationService();
  private readonly view: AppView;

  private searchQuery = '';
  private bookPage = 1;
  private userPage = 1;

  constructor(container: HTMLElement) {
    this.bookLibrary = new Library<Book>(this.bookStorage.load().map(Book.fromJSON));
    this.userLibrary = new Library<User>(this.userStorage.load().map(User.fromJSON));
    this.borrowService = new BorrowService(this.bookLibrary, this.userLibrary);

    // UI-шар підписується на сповіщення і показує їх у модальному вікні (alert заборонено)
    this.notifications.subscribe((notification) => showModal(notification));

    this.view = mountApp(container, {
      onAddBook: (book) => this.handleAddBook(book),
      onAddUser: (user) => this.handleAddUser(user),
      bookList: {
        onBorrow: (book) => this.handleBorrowClick(book),
        onReturn: (book) => this.handleReturn(book),
        onDelete: (book) => this.handleDeleteBook(book),
        onSearch: (query) => this.handleSearch(query),
        onPageChange: (page) => this.handleBookPageChange(page),
      },
      userList: {
        onDelete: (user) => this.handleDeleteUser(user),
        onPageChange: (page) => this.handleUserPageChange(page),
      },
    });
    this.refresh();
  }

  private persist(): void {
    this.bookStorage.save(this.bookLibrary.getAll().map((book) => book.toJSON()));
    this.userStorage.save(this.userLibrary.getAll().map((user) => user.toJSON()));
  }

  private refresh(): void {
    this.view.update({
      books: this.bookLibrary.getAll(),
      users: this.userLibrary.getAll(),
      searchQuery: this.searchQuery,
      bookPage: this.bookPage,
      userPage: this.userPage,
    });
  }

  private commit(): void {
    this.persist();
    this.refresh();
  }

  private handleAddBook(book: Book): void {
    this.bookLibrary.add(book);
    this.commit();
  }

  private handleAddUser(user: User): void {
    this.userLibrary.add(user);
    this.commit();
  }

  private handleDeleteBook(book: Book): void {
    this.borrowService.removeBook(book.getId());
    this.commit();
  }

  private handleDeleteUser(user: User): void {
    this.borrowService.removeUser(user.getId());
    this.commit();
  }

  private handleSearch(query: string): void {
    this.searchQuery = query;
    this.bookPage = 1;
    this.refresh();
  }

  private handleBookPageChange(page: number): void {
    this.bookPage = page;
    this.refresh();
  }

  private handleUserPageChange(page: number): void {
    this.userPage = page;
    this.refresh();
  }

  private describe(book: Book): string {
    return `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()})`;
  }

  private failureMessage(reason: BorrowFailureReason, user?: User): string {
    switch (reason) {
      case 'LIMIT_REACHED':
        return `Користувач ${user?.getName() ?? ''} вже має максимальну кількість позичених книг (3). Поверніть одну з них, щоб позичити нову.`;
      case 'ALREADY_BORROWED':
        return 'Ця книга вже позичена.';
      case 'USER_NOT_FOUND':
        return 'Користувача з таким ID не знайдено';
      case 'BOOK_NOT_FOUND':
        return 'Книгу не знайдено.';
    }
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

        const result = this.borrowService.borrow(book.getId(), value);

        if (!result.success) {
          const user = this.userLibrary.findById(value);
          const message = this.failureMessage(result.reason, user);
          if (result.reason === 'LIMIT_REACHED') {
            // ліміт у 3 книги - окреме модальне вікно, як вимагає завдання
            this.notifications.error('Ліміт позичених книг', message, 'Зрозуміло!');
            return undefined;
          }
          // "користувача не знайдено" / інше - помилка прямо у полі вводу
          return message;
        }

        this.commit();
        this.notifications.success(
          'Книгу позичено',
          `${this.describe(result.book)} has been borrowed by ${result.user.getId()} ${result.user.getName()} (${result.user.getEmail()}).`,
          'Зрозуміло!',
        );
        return undefined;
      },
    });
  }

  private handleReturn(book: Book): void {
    const returned = this.borrowService.returnBook(book.getId());
    if (!returned) {
      return;
    }
    this.commit();
    this.notifications.info(
      'Книгу повернено',
      `${this.describe(returned)} has been returned.`,
      'Закрити',
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (!container) {
    throw new Error('#app container not found');
  }
  new App(container);
});
  