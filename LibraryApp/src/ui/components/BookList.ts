<<<<<<< HEAD
import { Book } from '../../models/Book.js';
import { User } from '../../models/User.js';
import { createButton } from './Button.js';
=======
import type { Book } from '../../models/Book';
import type { User } from '../../models/User';
import type { Page } from '../../utils/pagination';
import { createButton } from './Button';
import { renderPagination } from './Pagination';
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)

export interface BookListHandlers {
  onBorrow: (book: Book) => void;
  onReturn: (book: Book) => void;
  onDelete: (book: Book) => void;
  onSearch: (query: string) => void;
<<<<<<< HEAD
}

export interface BookListProps {
  books: Book[];
  users: User[];
  searchQuery: string;
  handlers: BookListHandlers;
=======
  onPageChange: (page: number) => void;
}

export interface BookListProps {
  page: Page<Book>;
  users: User[];
}

export interface BookListView {
  update(props: BookListProps): void;
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
}

function findUserName(users: User[], userId: string | null): string {
  if (!userId) return '';
  const user = users.find((u) => u.getId() === userId);
  return user ? `${user.getName()} (${user.getEmail()})` : userId;
}

<<<<<<< HEAD
export function renderBookList(container: HTMLElement, props: BookListProps): void {
=======
/**
 * Створює картку "Список книг" один раз. Поле пошуку живе постійно (не перестворюється),
 * тому не втрачає фокус під час введення; update() перемальовує лише рядки та пагінацію.
 */
export function createBookListView(
  container: HTMLElement,
  handlers: BookListHandlers,
): BookListView {
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
  const card = document.createElement('div');
  card.className = 'card p-3 mb-4';

  const heading = document.createElement('h5');
  heading.textContent = 'Список Книг';

  const search = document.createElement('input');
<<<<<<< HEAD
  search.type = 'text';
  search.className = 'form-control mb-3';
  search.placeholder = 'Пошук за назвою або автором...';
  search.value = props.searchQuery;
  search.addEventListener('input', () => props.handlers.onSearch(search.value));

  const list = document.createElement('div');

  if (props.books.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Книг не знайдено.';
    list.append(empty);
  }

  props.books.forEach((book) => {
    const row = document.createElement('div');
    row.className =
      'd-flex justify-content-between align-items-center border-bottom py-2 gap-2';

    const info = document.createElement('span');
    const borrowedInfo = book.isBorrowed()
      ? ` — позичено: ${findUserName(props.users, book.getBorrowedBy())}`
      : '';
    info.textContent = `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()})${borrowedInfo}`;

    const actions = document.createElement('div');
    actions.className = 'd-flex gap-2';

    const actionBtn = book.isBorrowed()
      ? createButton('Повернути', 'warning', 'button', () => props.handlers.onReturn(book))
      : createButton('Позичити', 'primary', 'button', () => props.handlers.onBorrow(book));

    const deleteBtn = createButton('Видалити', 'danger', 'button', () =>
      props.handlers.onDelete(book),
    );

    actions.append(actionBtn, deleteBtn);
    row.append(info, actions);
    list.append(row);
  });

  card.append(heading, search, list);
  container.append(card);
=======
  search.type = 'search';
  search.className = 'form-control mb-3';
  search.placeholder = 'Пошук за назвою або автором...';
  search.addEventListener('input', () => handlers.onSearch(search.value));

  const list = document.createElement('div');
  const pagination = document.createElement('div');

  card.append(heading, search, list, pagination);
  container.append(card);

  return {
    update({ page, users }: BookListProps): void {
      list.replaceChildren();

      if (page.items.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-muted mb-0';
        empty.textContent = 'Книг не знайдено.';
        list.append(empty);
      }

      page.items.forEach((book) => {
        const row = document.createElement('div');
        row.className =
          'd-flex justify-content-between align-items-center border-bottom py-2 gap-2';

        const info = document.createElement('span');
        const borrowedInfo = book.isBorrowed()
          ? ` — позичено: ${findUserName(users, book.getBorrowedBy())}`
          : '';
        info.textContent = `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()})${borrowedInfo}`;

        const actions = document.createElement('div');
        actions.className = 'd-flex gap-2';

        const actionBtn = book.isBorrowed()
          ? createButton('Повернути', 'warning', 'button', () => handlers.onReturn(book))
          : createButton('Позичити', 'primary', 'button', () => handlers.onBorrow(book));
        const deleteBtn = createButton('Видалити', 'danger', 'button', () =>
          handlers.onDelete(book),
        );

        actions.append(actionBtn, deleteBtn);
        row.append(info, actions);
        list.append(row);
      });

      renderPagination(pagination, {
        page: page.page,
        totalPages: page.totalPages,
        onChange: handlers.onPageChange,
      });
    },
  };
>>>>>>> d08e7be7 (fix: typical error fixes + finished configurations)
}
