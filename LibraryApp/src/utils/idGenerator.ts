let counter = 0;

/**
 * Генерує унікальний id, що складається лише з цифр:
 * поточний час (мс) + 3-цифровий лічильник (щоб id не повторювались в межах однієї мілісекунди).
 */
export function generateId(): string {
  counter = (counter + 1) % 1000;
  return `${Date.now()}${String(counter).padStart(3, '0')}`;
}
