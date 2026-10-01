import { User } from '../../models/User.js';
import { Validation } from '../../utils/validators.js';
import type { UserFormData } from '../../types/index.js';
import { createButton } from './Button.js';

interface FieldRefs {
  wrapper: HTMLDivElement;
  input: HTMLInputElement;
  errorEl: HTMLDivElement;
}

function createField(name: string, placeholder: string, type: string): FieldRefs {
  const wrapper = document.createElement('div');
  wrapper.className = 'mb-2';

  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.className = 'form-control';
  input.placeholder = placeholder;

  const errorEl = document.createElement('div');
  errorEl.className = 'text-danger small mt-1';

  wrapper.append(input, errorEl);
  return { wrapper, input, errorEl };
}

function applyErrors(fields: Record<string, FieldRefs>, errors: Record<string, string>): void {
  Object.entries(fields).forEach(([key, field]) => {
    const error = errors[key];
    field.errorEl.textContent = error ?? '';
    field.input.classList.toggle('is-invalid', Boolean(error));
  });
}

/** Рендерить форму "Додати користувача" у контейнер та підключає обробник сабміту. */
export function renderUserForm(container: HTMLElement, onSubmit: (user: User) => void): void {
  const card = document.createElement('div');
  card.className = 'card p-3 mb-4';

  const heading = document.createElement('h5');
  heading.textContent = 'Додати Користувача';

  const form = document.createElement('form');

  const nameField = createField('name', "Ім'я", 'text');
  const emailField = createField('email', 'Email', 'email');

  const submitBtn = createButton('Додати Користувача', 'success', 'submit');

  form.append(nameField.wrapper, emailField.wrapper, submitBtn);

  const fields: Record<string, FieldRefs> = {
    name: nameField,
    email: emailField,
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data: UserFormData = {
      name: nameField.input.value,
      email: emailField.input.value,
    };

    const result = Validation.validateUserForm(data);
    applyErrors(fields, result.errors);
    if (!result.isValid) {
      return;
    }

    onSubmit(new User(data.name.trim(), data.email.trim()));
    form.reset();
    applyErrors(fields, {});
  });

  card.append(heading, form);
  container.append(card);
}
