import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { renderBookForm } from './components/BookForm.js';
import { renderUserForm } from './components/UserForm.js';
import { renderBookList, type BookListHandlers } from './components/BookList.js';
import { renderUserList, type UserListHandlers } from './components/UserList.js';

export interface AppState {
  books: Book[];
  users: User[];
  searchQuery: string;
}

export interface AppHandlers {
  onAddBook: (book: Book) => void;
  onAddUser: (user: User) => void;
  bookList: BookListHandlers;
  userList: UserListHandlers;
}

/** Повністю перерендерює вміст #app на основі поточного стану. */
export function render(container: HTMLElement, state: AppState, handlers: AppHandlers): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'app-wrapper py-4';

  const title = document.createElement('h1');
  title.className = 'text-center mb-4';
  title.textContent = 'Система Управління Бібліотекою';

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
}
