import { MAX_BOOKS_PER_USER } from '../../constants';
import type { User } from '../../models/User';
import type { Page } from '../../utils/pagination';
import { createButton } from './Button';
import { renderPagination } from './Pagination';

export interface UserListHandlers {
  onDelete: (user: User) => void;
  onPageChange: (page: number) => void;
}

export interface UserListView {
  update(page: Page<User>): void;
}

/** Створює картку "Список користувачів" один раз; update() перемальовує рядки та пагінацію. */
export function createUserListView(
  container: HTMLElement,
  handlers: UserListHandlers,
): UserListView {
  const card = document.createElement('div');
  card.className = 'card p-3 mb-4';

  const heading = document.createElement('h5');
  heading.textContent = 'Список Користувачів';

  const list = document.createElement('div');
  const pagination = document.createElement('div');

  card.append(heading, list, pagination);
  container.append(card);

  return {
    update(page: Page<User>): void {
      list.replaceChildren();

      if (page.items.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-muted mb-0';
        empty.textContent = 'Користувачів не знайдено.';
        list.append(empty);
      }

      page.items.forEach((user) => {
        const row = document.createElement('div');
        row.className =
          'd-flex justify-content-between align-items-center border-bottom py-2 gap-2';

        const info = document.createElement('span');
        info.textContent = `${user.getId()} ${user.getName()} (${user.getEmail()}) — книг на руках: ${user.getBorrowedBookIds().length}/${MAX_BOOKS_PER_USER}`;

        const deleteBtn = createButton('Видалити', 'danger', 'button', () =>
          handlers.onDelete(user),
        );

        row.append(info, deleteBtn);
        list.append(row);
      });

      renderPagination(pagination, {
        page: page.page,
        totalPages: page.totalPages,
        onChange: handlers.onPageChange,
      });
    },
  };
}
