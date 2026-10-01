import type { ModalType } from '../../types/index';

export interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmLabel?: string;
}

export interface PromptModalOptions {
  title: string;
  placeholder?: string;
  /** Повертає текст помилки, якщо значення некоректне, інакше undefined - тоді модал закривається. */
  onSave: (value: string) => string | undefined;
  onCancel?: () => void;
}

function closeModal(overlay: HTMLElement): void {
  overlay.remove();
}

function createOverlay(): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.className = 'app-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  return overlay;
}

function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'app-modal-card card p-4';
  return card;
}

function createHeader(titleText: string, onClose: () => void): HTMLDivElement {
  const header = document.createElement('div');
  header.className = 'd-flex justify-content-between align-items-start mb-3';

  const title = document.createElement('h5');
  title.className = 'mb-0';
  title.textContent = titleText;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn-close';
  closeBtn.setAttribute('aria-label', 'Закрити');
  closeBtn.addEventListener('click', onClose);

  header.append(title, closeBtn);
  return header;
}

/** Просте інформаційне модальне вікно (сповіщення) замість alert(). */
export function showModal(options: ModalOptions): void {
  const overlay = createOverlay();
  const card = createCard();
  const close = (): void => closeModal(overlay);

  const header = createHeader(options.title, close);

  const message = document.createElement('p');
  message.className = 'mb-4';
  message.textContent = options.message;
  message.style.whiteSpace = 'pre-line';

  const footer = document.createElement('div');
  footer.className = 'text-end';

  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  const variant = options.type === 'error' ? 'danger' : 'primary';
  confirmBtn.className = `btn btn-${variant}`;
  confirmBtn.textContent = options.confirmLabel ?? 'Зрозуміло!';
  confirmBtn.addEventListener('click', close);

  footer.append(confirmBtn);
  card.append(header, message, footer);
  overlay.append(card);
  document.body.append(overlay);

  confirmBtn.focus();
}

/** Модальне вікно із полем вводу (напр. id користувача для позичання книги). */
export function showPromptModal(options: PromptModalOptions): void {
  const overlay = createOverlay();
  const card = createCard();
  const cancel = (): void => {
    closeModal(overlay);
    options.onCancel?.();
  };

  const header = createHeader(options.title, cancel);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control mb-2';
  input.placeholder = options.placeholder ?? '';

  const errorEl = document.createElement('div');
  errorEl.className = 'text-danger small mb-3';

  const footer = document.createElement('div');
  footer.className = 'd-flex justify-content-end gap-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Скасувати';
  cancelBtn.addEventListener('click', cancel);

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn-primary';
  saveBtn.textContent = 'Зберегти';
  saveBtn.addEventListener('click', () => {
    // спочатку закриваємо вікно, щоб обробник міг показати інше модальне вікно поверх
    const error = options.onSave(input.value.trim());
    if (error) {
      errorEl.textContent = error;
      return;
    }
    closeModal(overlay);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveBtn.click();
    } else if (event.key === 'Escape') {
      cancel();
    }
  });

  footer.append(cancelBtn, saveBtn);
  card.append(header, input, errorEl, footer);
  overlay.append(card);
  document.body.append(overlay);

  input.focus();
}
