import { Book } from '../../models/Book';
import { Validation } from '../../utils/validators';
import type { BookFormData } from '../../types/index';
import { createButton } from './Button';
import { applyErrors, createField, type FieldRefs } from './FormField';

/** Рендерить форму "Додати книгу" у контейнер та підключає обробник сабміту. */
export function renderBookForm(container: HTMLElement, onSubmit: (book: Book) => void): void {
  const card = document.createElement('div');
  card.className = 'card p-3 mb-4';

  const heading = document.createElement('h5');
  heading.textContent = 'Додати Книгу';

  const form = document.createElement('form');
  // вимикаємо нативну валідацію браузера, щоб показувати власні повідомлення
  form.noValidate = true;

  const titleField = createField('title', 'Назва книги');
  const authorField = createField('author', 'Автор');
  const yearField = createField('year', 'Рік видання');

  const submitBtn = createButton('Додати Книгу', 'success', 'submit');

  form.append(titleField.wrapper, authorField.wrapper, yearField.wrapper, submitBtn);

  const fields: Record<string, FieldRefs> = {
    title: titleField,
    author: authorField,
    year: yearField,
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data: BookFormData = {
      title: titleField.input.value,
      author: authorField.input.value,
      year: yearField.input.value,
    };

    const result = Validation.validateBookForm(data);
    applyErrors(fields, result.errors);
    if (!result.isValid) {
      return;
    }

    onSubmit(new Book(data.title.trim(), data.author.trim(), Number(data.year.trim())));
    form.reset();
    applyErrors(fields, {});
  });

  card.append(heading, form);
  container.append(card);
}
