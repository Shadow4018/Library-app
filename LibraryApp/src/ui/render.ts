<<<<<<< HEAD
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { renderBookForm } from './components/BookForm.js';
import { renderUserForm } from './components/UserForm.js';
import { renderBookList, type BookListHandlers } from './components/BookList.js';
import { renderUserList, type UserListHandlers } from './components/UserList.js';
=======
import { PAGE_SIZE } from '../constants';
import type { Book } from '../models/Book';
import type { User } from '../models/User';
import { paginate } from '../utils/pagination';
import { filterBooks } from '../utils/search';
import { renderBookForm } from './components/BookForm';
import { createBookListView, type BookListHandlers } from './components/BookList';
import { renderUserForm } from './components/UserForm';
import { createUserListView, type UserListHandlers } from './components/UserList';
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)

export interface AppState {
  books: Book[];
  users: User[];
  searchQuery: string;
<<<<<<< HEAD
=======
  bookPage: number;
  userPage: number;
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
}

export interface AppHandlers {
  onAddBook: (book: Book) => void;
  onAddUser: (user: User) => void;
  bookList: BookListHandlers;
  userList: UserListHandlers;
}

<<<<<<< HEAD
/** Повністю перерендерює вміст #app на основі поточного стану. */
export function render(container: HTMLElement, state: AppState, handlers: AppHandlers): void {
  container.innerHTML = '';
=======
export interface AppView {
  update(state: AppState): void;
}

/**
 * Монтує каркас застосунку в #app один раз (форми та заголовки не перестворюються),
 * а update() оновлює лише списки. Завдяки цьому не втрачається введений у форми текст і фокус пошуку.
 */
export function mountApp(container: HTMLElement, handlers: AppHandlers): AppView {
  container.replaceChildren();
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)

  const wrapper = document.createElement('div');
  wrapper.className = 'app-wrapper py-4';

  const title = document.createElement('h1');
  title.className = 'text-center mb-4';
  title.textContent = 'Система Управління Бібліотекою';
<<<<<<< HEAD

  const filteredBooks = filterBooks(state.books, state.searchQuery);

  wrapper.append(title);
  renderBookForm(wrapper, handlers.onAddBook);
  renderUserForm(wrapper, handlers.onAddUser);
  renderBookList(wrapper, {
    books: filteredBooks,
    users: state.users,
    searchQuery: state.searchQuery,
    handlers: handlers.bookList,
  });
  renderUserList(wrapper, state.users, handlers.userList);

  container.append(wrapper);
}

function filterBooks(books: Book[], query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return books;
  return books.filter(
    (book) => book.getTitle().toLowerCase().includes(q) || book.getAuthor().toLowerCase().includes(q),
  );
=======
  wrapper.append(title);

  renderBookForm(wrapper, handlers.onAddBook);
  renderUserForm(wrapper, handlers.onAddUser);
  const bookList = createBookListView(wrapper, handlers.bookList);
  const userList = createUserListView(wrapper, handlers.userList);

  container.append(wrapper);

  return {
    update(state: AppState): void {
      const filteredBooks = filterBooks(state.books, state.searchQuery);
      bookList.update({
        page: paginate(filteredBooks, state.bookPage, PAGE_SIZE),
        users: state.users,
      });
      userList.update(paginate(state.users, state.userPage, PAGE_SIZE));
    },
  };
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
}
