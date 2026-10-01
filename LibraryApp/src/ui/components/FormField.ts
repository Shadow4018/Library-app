export interface FieldRefs {
  wrapper: HTMLDivElement;
  input: HTMLInputElement;
  errorEl: HTMLDivElement;
}

/** Поле форми: input + блок для тексту помилки валідації. */
export function createField(name: string, placeholder: string, type = 'text'): FieldRefs {
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

/** Показує помилки під відповідними полями (для полів без помилки - очищає). */
export function applyErrors(
  fields: Record<string, FieldRefs>,
  errors: Record<string, string>,
): void {
  Object.entries(fields).forEach(([key, field]) => {
    const error = errors[key];
    field.errorEl.textContent = error ?? '';
    field.input.classList.toggle('is-invalid', Boolean(error));
  });
}
