import { Book } from '../../models/Book.js';
import { User } from '../../models/User.js';
import { createButton } from './Button.js';

export interface BookListHandlers {
  onBorrow: (book: Book) => void;
  onReturn: (book: Book) => void;
  onDelete: (book: Book) => void;
  onSearch: (query: string) => void;
}

export interface BookListProps {
  books: Book[];
  users: User[];
  searchQuery: string;
  handlers: BookListHandlers;
}

function findUserName(users: User[], userId: string | null): string {
  if (!userId) return '';
  const user = users.find((u) => u.getId() === userId);
  return user ? `${user.getName()} (${user.getEmail()})` : userId;
}

export function renderBookList(container: HTMLElement, props: BookListProps): void {
  const card = document.createElement('div');
  card.className = 'card p-3 mb-4';

  const heading = document.createElement('h5');
  heading.textContent = 'Список Книг';

  const search = document.createElement('input');
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
}
