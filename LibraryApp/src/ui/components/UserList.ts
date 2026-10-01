import { User } from '../../models/User.js';
import { createButton } from './Button.js';

export interface UserListHandlers {
  onDelete: (user: User) => void;
}

export function renderUserList(
  container: HTMLElement,
  users: User[],
  handlers: UserListHandlers,
): void {
  const card = document.createElement('div');
  card.className = 'card p-3 mb-4';

  const heading = document.createElement('h5');
  heading.textContent = 'Список Користувачів';

  const list = document.createElement('div');

  if (users.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Користувачів не знайдено.';
    list.append(empty);
  }

  users.forEach((user) => {
    const row = document.createElement('div');
    row.className =
      'd-flex justify-content-between align-items-center border-bottom py-2 gap-2';

    const info = document.createElement('span');
    info.textContent = `${user.getId()} ${user.getName()} (${user.getEmail()}) — книг на руках: ${user.getBorrowedBookIds().length}/3`;

    const deleteBtn = createButton('Видалити', 'danger', 'button', () => handlers.onDelete(user));

    row.append(info, deleteBtn);
    list.append(row);
  });

  card.append(heading, list);
  container.append(card);
}
